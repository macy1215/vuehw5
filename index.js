import userModal from './components/productModal.js'
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl= `https://vue3-course-api.hexschool.io/v2`; 
const path= 'maciw2';


const { createApp } = Vue //因為載入了 global 所以這邊直接引入

const app=createApp({
    data(){
        return{
            apiUrl,
            path,
            products : [''], //資料存放
            tempProduct:{
                imagesUrl:[],
            }, //暫存區
            myModal: null, //產品 modal 
            page:{},
            status:{
                addCartLoading: '',
                showCartLoading:'',
                cartQtyLoading:'',
            },
            //購物車列表
            carts:{},
            //isLoading: true,
            //表單
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            // city:[
            //     "台北市",
            //     "基隆市",
            //     "新北市",
            //     "連江縣",
            //     "宜蘭縣",
            //     "新竹市",
            //     "新竹縣",
            //     "桃園市",
            //     "苗栗縣",
            //     "台中市",
            //     "彰化縣",
            //     "南投縣",
            //     "嘉義市",
            //     "嘉義縣",
            //     "雲林縣",
            //     "台南市",
            //     "高雄市",
            //     "澎湖縣",
            //     "金門縣",
            //     "屏東縣",
            //     "台東縣",
            //     "花蓮縣",
            //     "請選擇地區"
            // ]
        }
    },

    methods:{
        getProductList(){
            axios.get(`${apiUrl}/api/${path}/products`)
            .then((res)=>{
                //console.log(res.data.products)
                this.products = res.data.products;
                this.isLoading=false;
            })
            .catch((err)=>{
                return alert(err.message);
            })
        },

        openModal(item){
            this.tempProduct={...item};
            this.$refs.pModal.openModal();
            console.log(this.tempProduct);
        },
        addToCart(product_id,qty){ //參數預設值先帶入
            //先將資料結構複製上來才不會記錯
            const order = {
                    product_id,
                    qty
            };
            //loading 
            this.status.addCartLoading =product_id; //指向當前 id
                axios.post(`${apiUrl}/api/${path}/cart`,{data:order})
                .then((res)=>{
                    console.log(res);
                    this.status.addCartLoading ='';
                    //加完購物車，會重跑顯示列表
                    this.getCart();
                    this.$refs.pModal.closeModal();
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        // /v2/api/{api_path}/cart
        getCart(){
            this.status.showCartLoading = this.carts.id
            axios.get(`${apiUrl}/api/${path}/cart`)
                .then((res)=>{
                    this.carts=res.data.data;
                    this.status.showCartLoading='';
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        changeCartQty(item,qty=1){ //將整個購物車 帶入
            const order = {
                product_id:item.product_id,
                qty
            };
            this.status.cartQtyLoading = item.id;
            //帶入購物車 id 
            axios.put(`${apiUrl}/api/${path}/cart/${item.id}`,{data:order})
                .then((res)=>{
                    console.log(res);
                    this.status.cartQtyLoading=''
                    //加完購物車，會重跑顯示列表
                    this.getCart();
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        removeCartItem(id){
            this.status.cartQtyLoading = id;
            this.status.showCartLoading = id;
            console.log(id)
            axios.delete(`${apiUrl}/api/${path}/cart/${id}`)
                .then((res)=>{
                    console.log(res);
                    this.status.cartQtyLoading=''
                    this.status.showCartLoading ='';
                    this.getCart();
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        removeAllCart(item){
                axios.delete(`${apiUrl}/api/${path}/carts`)
                .then((res)=>{
                    this.getCart();
                })
                .catch((err)=>{
                    return window.alert(err.data.message);
                })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        createOrder() {
            //console.log(this.form);
            const order = this.form;

            axios.post(`${apiUrl}/api/${path}/order`, {data : order})
                .then((res)=>{
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err)=>{
                    alert(err.response.data.message);
                })

          },
    },
    mounted(){
        //初始化
        console.log(VueLoading)
        setTimeout(()=>{
            this.getProductList();
            this.getCart();
            // this.isLoading=false;
        },1000)
        
    },
    components:{
        userModal,
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    }
});
app.component('loading', VueLoading.Component)


app.mount('#app');



