export default {
  template: `<div
  class="modal fade"
  ref="productModal"
  tabindex="-1"
  aria-labelledby="productModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content border-0">
      <div class="modal-header bg-success text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span>新增產品</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-1">
              <div class="form-group">
                <label class="text-light bg-secondary mb-2 py-1 px-2" for="mainImageUrl">請輸入主圖片網址</label>
                <input
                  id="mainImageUrl"
                  type="text"
                  class="form-control"
                  placeholder="請輸入圖片連結"
                  v-model.trim="whereProduct.imageUrl"
                />
                <img
                  class="img-fluid my-3 form-img"
                  :src="whereProduct.imageUrl"
                  :alt="whereProduct.title"
                />
              </div>

              <div>
              <label class="btn btn-outline-success btn-sm d-block w-100 mt-3">
                <input id="upload_img" style="display:none;" type="file" @change="uploadMainImgage">
                上傳圖片
              </label>
              </div>

            </div>
            <div class="mt-4 mb-1">多圖新增</div>
            <!-- 大寫開頭 建構函式 -->
            <div v-if="Array.isArray(whereProduct.imagesUrl)">
              <div
                class="mb-4"
                v-for="(item,index) in whereProduct.imagesUrl"
                :key="'addImage'+index"
              >
              <hr>
                <div class="form-group">
                  <label class="text-light bg-secondary mb-2 py-1 px-2" for="subImageUrl">請輸入副圖片 {{index+1}} 的網址</label>
                  <input
                    id="subImageUrl"
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                    v-model="whereProduct.imagesUrl[index]"
                  />
                  <img class="img-fluid my-3 form-img" :src="item" alt />

                    <div>
                    <label class="btn btn-outline-success btn-sm d-block w-100 my-3">
                      <input id="upload_img" style="display:none;" type="file" @change="uploadSubImgage">
                      上傳圖片
                    </label>
                    </div>

                  <div class="mb2">
                    <button
                      class="btn btn-outline-danger btn-sm d-block w-100"
                      @click="whereProduct.imagesUrl.splice(index,1)"
                    >
                      刪除圖片
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="mt-4"
                v-if="!whereProduct.imagesUrl.length || whereProduct.imagesUrl[whereProduct.imagesUrl.length-1]"
              >
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="whereProduct.imagesUrl.push('')"
                >
                  新增圖片
                </button>
              </div>
            </div>
            <div v-else>
              <div class="mt-4 mb-2">
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImages"
                >
                  新增圖片
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input
                id="title"
                type="text"
                class="form-control mt-1"
                placeholder="請輸入標題"
                v-model.trim="whereProduct.title"
              />
            </div>

            <div class="row mt-3">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input
                  id="category"
                  type="text"
                  class="form-control mt-1"
                  placeholder="請輸入分類"
                  v-model="whereProduct.category"
                />
              </div>
              <div class="form-group col-md-6">
                <label for="unit">單位(個、台、隻...)</label>
                <input
                  id="unit"
                  type="text"
                  class="form-control mt-1"
                  placeholder="請輸入單位"
                  v-model="whereProduct.unit"
                />
              </div>
            </div>

            <div class="row mt-3">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input
                  id="origin_price"
                  type="number"
                  min="0"
                  class="form-control mt-1"
                  placeholder="請輸入原價"
                  v-model.number="whereProduct.origin_price"
                />
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  class="form-control mt-1"
                  placeholder="請輸入售價"
                  v-model.number="whereProduct.price"
                />
              </div>
            </div>
            <hr />

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea
                id="description"
                type="text"
                class="form-control mt-1"
                placeholder="請輸入產品描述"
                rows="6"
                v-model.trim="whereProduct.description"
              >
              </textarea>
            </div>
            <div class="form-group mt-3">
              <label for="content">商品規格</label>
              <textarea
                id="content"
                type="text"
                class="form-control mt-1"
                placeholder="請輸入商品規格"
                rows="4"
                v-model.trim="whereProduct.content"
              >
              </textarea>
            </div>
            <div class="form-group mt-3">
              <div class="form-check">
                <input
                  id="is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  v-model="whereProduct.is_enabled"
                />
                <label class="form-check-label" for="is_enabled"
                  >是否啟用</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="$emit('update-product',whereProduct)"
        >
          確認
        </button>
      </div>
    </div>
  </div>
  </div>`,
  props: {
    whereProduct: {
      type: Object, // 驗證型別
      default(){
        return {
        }
      }
    },
  },
  methods: {
    // 新增陣列圖片
    createImages() {
      this.whereProduct.imagesUrl = ['']
    },
    uploadMainImgage(e) {
      console.dir(e);
      const url = `${baseUrl}/api/${apiPath}/admin/upload`
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", file);
      axios
        .post(url, formData)
        .then((res) => {
          console.log(res);
          this.whereProduct.imageUrl = res.data.imageUrl;
        }).catch((err=>{
          console.log(err);
        }));
    },
    uploadSubImgage(e) {
      console.dir(e);
      const url = `${baseUrl}/api/${apiPath}/admin/upload`
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file-to-upload", file);
      axios
        .post(url, formData)
        .then((res) => {
          console.log(res);
          this.whereProduct.imagesUrl[this.whereProduct.imagesUrl.length-1]= res.data.imageUrl;
        }).catch((err=>{
          console.log(err);
        }));
    },
    openAdminModal(){
      this.modal.show();
    },
    closeAdminModal(){
      this.modal.hide();
    },
  },
  data(){
    return {
      modal: '',
    }
  },
  mounted(){
    // Bootstrap Modal實體掛載
    this.modal = new bootstrap.Modal(this.$refs.productModal);
  }
}