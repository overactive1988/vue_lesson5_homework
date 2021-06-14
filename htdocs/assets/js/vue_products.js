import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js'
import pagination from './pagination.js'
import adminProducts from './admin/adminProductModal.js'

const app = createApp({
  data() {
    return {
      // 一律使用 function return 資料定義初始化都在這
      // 使用this.即可呼叫此處資料內容
      isNew: true,
      products: [], // 主要商品結構
      allproductsNum: '', // 合計商品數量
      tempProduct: {
        // 稍後調整資料使用的準備結構
        imagesUrl: [],
      },
      pagination:{},
    }
  },
  // 區域註冊
  components: {
    pagination
  },
  mounted() {
    // 生命週期 → 元素掛載完成後觸發
    // 類似像 JS init() 初始化 第一個執行的函式
    // 取得 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    // 將 Token 夾帶至請請求(request) 的表頭(headers) 設定只需要一次
    axios.defaults.headers.common['Authorization'] = token

    this.loginCheck()
    this.getData()
  },
  methods: {
    // 函式的集合
    // 檢查使用者是否仍持續登入
    loginCheck() {
      const url = `${baseUrl}/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          if (res.data.success) {
            console.log('已確認為使用者本人登入')
          } else {
            alert('您尚未登入，請重新登入')
            window.location = './login.html'
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 取得產品列表
    getData(num = this.pagination.current_page || 1) { // 參數預設值
      const url = `${baseUrl}/api/${apiPath}/admin/products?page=${num}`;
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
    // 刪除單筆商品
    deleteProduct() {
      const url = `${baseUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          this.$refs.adminDelModal.closeAdminModal() // 關掉 modal
          alert(`已刪除${this.tempProduct.title}商品`)
          this.getData()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 開啟modal
    openModal(isNew, item) {
      // console.log(isNew, item)
      switch (isNew) {
        case 'new':
          // 先將預設物件內容清空
          this.tempProduct = {
            imagesUrl: [],
          }
          this.isNew = true
          this.$refs.adminControlModal.openAdminModal()
          break
        case 'edit':
          // 因為傳參考特性會連動到資料，因此將資料進行淺層複製
          this.getData()
          this.tempProduct = { ...item}
          this.isNew = false
          this.$refs.adminControlModal.openAdminModal()
          break
        case 'delete':
          // 因為傳參考特性會連動到資料，因此將資料進行淺層複製
          this.tempProduct = { ...item}
          // Modal需要拿到 title 和刪除按鈕時需要獲得 id
          this.$refs.adminDelModal.openAdminModal()
          break
        default:
          break
      }
    },
    // 於modal內按下確認按鈕時觸發
    updateProduct(tempProduct) {
      // 預設為 新增
      let url = `${baseUrl}/api/${apiPath}/admin/product/`
      let httpMethod = 'post'
      // 根據 isNew 來判斷要串接 post 或是 put API
      if (!this.isNew) {
        // 進入編輯狀態
        url = `${baseUrl}/api/${apiPath}/admin/product/${tempProduct.id}`
        httpMethod = 'put'
      }
      axios[httpMethod](url, { data: tempProduct }) // post 或 put
        .then((res) => {
          if (res.data.success) {
            this.$refs.adminControlModal.closeAdminModal() // 關掉 modal
            this.getData() // 重整畫面
          } else {
            alert(res.data.message)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 取得所有產品數量
    getAllproducts() {
      const url = `${baseUrl}/api/${apiPath}/admin/products/all`;
      axios.get(url).then((res) => {
        console.log(res);
        this.allproductsNum = Object.values(res.data.products) // 將回傳的物件轉換為陣列
      })
    },
  },
  // created() {
  //   // 元件生成，必定會執行的項目
  // },
})

// 定義全域元件 須放置在 createApp 後方，mount之前
// 商品 Modal
app.component('adminProductModal',adminProducts)

// 將 deleteModal x-template 元件化
app.component('delProductModal',{
  props: {
    tempProduct: {
      type: Object,
      default(){
        return {
        }
      }
    },
  },
  template: "#delModal-template",
  data() {
    return {
      modal: '',
    }
  },
  mounted(){
    // Bootstrap Modal實體掛載
    this.modal = new bootstrap.Modal(this.$refs.delProductModal);
  },
  methods:{
    openAdminModal(){
      this.modal.show();
    },
    closeAdminModal(){
      this.modal.hide();
    },
  },
})
app.mount('#app')
