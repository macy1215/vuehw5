export default{
    props:['tempProduct','addToCart','status'], 
    // temP 要紀錄產品數量
    data(){
        return{
            myModal:null,
            qty:1, //將數量套用在 modal 的 input 上 
        }
    },
    methods:{
        openModal(){
            this.myModal.show();
            this.qty=1;
        },
        closeModal(item){
            this.myModal.hide();
        },
    },
    watch:{
        //tempProduct 有變化 就重置
        tempProduct(){
            this.qty=1;
        } 
    },
    template:'#userProductModal',
    mounted(){
        this.myModal=new bootstrap.Modal(this.$refs.modal);
    }
}

