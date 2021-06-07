const app = {
  data() {
    // 一律使用 function return 資料定義初始化都在這
    // 使用this.即可呼叫此處資料內容
    return {
      loginData: {},
    }
  },
  mounted() {
    // 生命週期 → 元素掛載完成後觸發
    // 類似像 JS init() 初始化 第一個執行的函式
  },
  methods: {
    // 函式的集合
    login() {
      const url = `${baseUrl}/admin/signin`;
      axios
        .post(url, this.loginData)
        .then((res) => {
          if (res.data.success) {
            // const token = res.data.token;
            // const expired = res.data.expired;
            // 使用解構
            const { token, expired } = res.data
            document.cookie = `hexToken=${token}; expires=${new Date(
              expired
            )}; path=/`
            // 跳轉至 products.html 頁面
            window.location = './products.html'
          } else {
            // 輸入資料錯誤報錯提醒
            alert(res.data.message)
            this.loginData = {}
          }
        })
        // axios報錯
        .catch((error) => {
          console.log(error)
        })
    },
  },
  // created() {
  //   // 元件生成，必定會執行的項目
  // },
}

Vue.createApp(app).mount('#app')
