import pagination from './pagination.js'
import userProductModal from './userProductModal.js'

const app = Vue.createApp({
    data(){
        return{
            loadingStatus:{
                loadingItem:'',
            },
            products:[],
            pagination:{},
            product:{},
            cart:{},
            allproductsNum:'',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                    },
                    message: '',
            },
        }
    },
    // 區域註冊
    components: {
        pagination
    },
    mounted(){
        this.getData();
        this.getCart();
    },
    methods: {
    // 取得產品列表
    getData(num = this.pagination.current_page || 1) { // 參數預設值
        const url = `${baseUrl}/api/${apiPath}/products?page=${num}`;
        axios
          .get(url)
          .then((res) => {
            if (res.data.success) {
              // this.products = res.data.products
              // this.pagination = res.data.pagination
              // 解構寫法
              const { products, pagination} = res.data;
              this.products = products
              this.pagination = pagination
              console.log(res.data)
              this.getAllproducts() // 重新取得產品數量
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    // 取得所有產品數量
    getAllproducts() {
    const url = `${baseUrl}/api/${apiPath}/products/all`;
    axios.get(url).then((res) => {
        this.allproductsNum = Object.values(res.data.products) // 將回傳的物件轉換為陣列
    })
    },
    openModal(item){
        this.loadingStatus.loadingItem = item.id;
        const url = `${baseUrl}/api/${apiPath}/product/${item.id}`;
        axios
        .get(url)
        .then((res) => {
            if (res.data.success) {
                this.product  = res.data.product;
                this.loadingStatus.loadingItem = '';
                this.$refs.userProductModal.openAdminModal()
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    addCart(id,qty =1){
        this.loadingStatus.loadingItem = id;
        const cartInfo = {
            data: {
                product_id: id,
                qty
            }
        }
        const url = `${baseUrl}/api/${apiPath}/cart`;
        axios
        .post(url,cartInfo)
        .then((res) => {
            this.loadingStatus.loadingItem = '';
            this.$refs.userProductModal.closeAdminModal();
            this.getCart();
          })
          .catch((error) => {
            console.log(error)
          })
    },
    getCart(){
        const url = `${baseUrl}/api/${apiPath}/cart`;
        axios
        .get(url)
        .then((res) => {
            console.log(res);
            if (res.data.success) {
                this.cart= res.data.data;
                console.log(this.cart.carts);
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    updateCart(item){
        this.loadingStatus.loadingItem = item.id;
        const cartInfo = {
            data: {
                product_id: item.product.id,
                qty: item.qty,
            }
        }
        const url = `${baseUrl}/api/${apiPath}/cart/${item.id}`;
        axios
        .put(url,cartInfo)
        .then((res) => {
            console.log(res);
            if (res.data.success) {
            this.loadingStatus.loadingItem = '';
            this.getCart();
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    isPhone(value) {
        const phoneNumber = /^(09)[0-9]{8}$/
        return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    onSubmit(){
        const orderInfo = {
          data: {
            user: this.form.user,
            message:this.form.message,
          },
        }
        console.log(orderInfo);
        const url = `${baseUrl}/api/${apiPath}/order`;
        axios
        .post(url,orderInfo)
        .then((res) => {
            console.log(res);
            if (res.data.success) {
            this.$refs.form.resetForm();
            alert(res.data.message);
            this.getCart();
            }
          })
          .catch((error) => {
            console.log(error)
          })
    },
    deleteCart(item){
      this.loadingStatus.loadingItem = item.id;
      const url = `${baseUrl}/api/${apiPath}/cart/${item.id}`;
      axios
      .delete(url)
      .then((res) => {
          if (res.data.success) {
          this.loadingStatus.loadingItem = '';
          alert(res.data.message);
          this.getCart();
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deleteCartAll(){
      const url = `${baseUrl}/api/${apiPath}/carts`;
      axios
      .delete(url)
      .then((res) => {
          if (res.data.success) {
          alert(res.data.message);
          this.getCart();
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    },
})

//定義規則 全部加入(CDN 版本)  
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });

//加入多國語系
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
  });


//註冊全域的表單驗證元件（VForm, VField, ErrorMessage）
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


// 定義全域元件 須放置在 createApp 後方，mount之前
// 客戶端商品 Modal
app.component('userProductModal',userProductModal)
app.mount('#app')