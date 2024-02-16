import {createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import userModal from './components/productModal.js'

const apiUrl= `https://vue3-course-api.hexschool.io/v2` 
const path= 'maciw2'


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
            isLoading:'',
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
                    console.log(this.carts)
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
                    console.log(res);
                    this.getCart();
                })
                .catch((err)=>{
                    return window.alert(err.data.message);
                })
        }
    },
    mounted(){
        //初始化
        this.isLoading=true;
        setTimeout(()=>{
            this.getProductList();
            this.getCart();
        },3000)
        
    },
    components:{
        userModal,
    }
});

app.use(VueLoading.LoadingPlugin);

app.mount('#app');



