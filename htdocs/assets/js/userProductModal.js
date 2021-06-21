export default {
    template:`<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true" ref="userProductModalTp">
     <div class="modal-dialog modal-xl" role="document">
       <div class="modal-content border-0">
         <div class="modal-header bg-dark text-white">
           <h5 class="modal-title" id="exampleModalLabel">
             <span>{{ tempProduct.title }}</span>
           </h5>
           <button type="button" class="btn-close"
                   data-bs-dismiss="modal" aria-label="Close"></button>
         </div>
         <div class="modal-body">
           <div class="row">
             <div class="col-sm-6">
               <img class="img-fluid" :src="tempProduct.imageUrl" alt="{{tempProduct.title}}">
             </div>
             <div class="col-sm-6">
               <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
               <p>商品描述：{{ tempProduct.description }}</p>
               <p>商品內容：{{ tempProduct.content }}</p>
               <div class="h5" v-if="!tempProduct.price">{{ tempProduct.origin_price }} 元</div>
               <del class="h6" v-if="tempProduct.price">原價 {{ tempProduct.origin_price }} 元</del>
               <div class="h5" v-if="tempProduct.price">現在只要 {{ tempProduct.price }} 元</div>
               <div>
                 <div class="input-group text-center">
                 <button type="button"
                 @click="$emit('cut-user-modal-product', tempProduct)"
                 class="btn-dark btn input-group-text rounded-0 fs-8 border-end-0"
                 :class="{ 'disabled': qty <= 1 }"
                 >
                   <span>-</span>
                 </button> 
                 <p class="form-control m-0">{{qty}}</p>
                 <button type="button"
                 @click="$emit('add-user-modal-product')"
                 class="btn-dark btn input-group-text rounded-0 fs-8"
                 >
                   <span>+</span>
                 </button> 
                   <button type="button" class="btn btn-primary"
                           @click="$emit('add-cart', tempProduct.id, qty)">加入購物車</button>
                 </div>
               </div>
             </div>
             <!-- col-sm-6 end -->
           </div>
         </div>
       </div>
     </div>
   </div>`,
   props: {
    userproduct: {
      type: Object, // 驗證型別
      default(){
        return {
        }
      }
    },
  },
  methods: {
    openAdminModal(){
    this.modal.show();
    this.qty=1;
    },
    closeAdminModal(){
    this.modal.hide();
    this.qty=1;
    },
  },
  data(){
    return {
      modal: '',
      qty:1,
      tempProduct:{
      },
    }
  },
  watch: {
    userproduct(){
        this.tempProduct = this.userproduct;
    }
  },
  mounted(){
    // Bootstrap Modal實體掛載
    this.modal = new bootstrap.Modal(this.$refs.userProductModalTp);
  }
}