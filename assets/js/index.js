import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// axios 套件 -> 預設匯入
import axios from "axios";

// sweetalert2 套件 -> 預設匯入
import Swal from "sweetalert2";

// API baseUrl
const url = "https://ec-course-api.hexschool.io/v2";

// API path
const path = "michaelhsia";

// 從 cookie 取得 token 資料
const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

let productModal = null;
let delProductModal = null;

// 有些 request 需要夾帶 token 才能使用，所以在發送請求時夾帶 headers 資料，放在全域的話，每次發請求都會自動夾帶
axios.defaults.headers.common["Authorization"] = token;

// 流程：
// 1. 抓到 input 帳密
// 2. 點擊按鈕後，發請求 post 到資料庫
// 3. 把 token 跟 expired 存到 cookie
// 4. 確認已有 token 進入到產品列表
// 5. index.html 要在 created 驗證是否有 token 存在 cookie 中，若沒有則 location.href 導入 login.html

const app = createApp({
  data() {
    return {
      // products 陣列存取外部回傳的產品資料
      products: [],
      isNew: false,
      // tempProduct 物件存取要渲染的產品細節
      tempProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
    // 未登入，會跳回登入頁面
    backToLogin() {
      setTimeout(() => (location.href = "login.html"), 1500);
    },

    // 發送請求抓取外部產品資料
    getProductData() {
      axios
        .get(`${url}/api/${path}/admin/products/all`)
        .then((res) => (this.products = res.data.products))
        .catch((err) => alert(`發生錯誤： ${err.response} 請檢查錯誤`));
    },
    openModal(isNew, item) {
      if (isNew === "new") {
        this.tempProduct = { imagesUrl: [] };
        this.isNew = true;
        productModal.show();
      }
    },
  },
  created() {
    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      { keyboard: false }
    );
    console.log(this.productModal);
    // 在created 時，驗證是否登入，如果沒通過驗證就跑 catch
    axios
      .post(`${url}/api/user/check`)
      // 有登入就抓取外部資料渲染畫面
      .then((res) => this.getProductData())
      .catch((err) => {
        // 未登入的提醒
        Swal.fire({
          title: "你好像還沒登入~",
          icon: "warning",
          showConfirmButton: false,
          timer: 1000,
        });

        // 觸發 backToLogin
        this.backToLogin();
      });
  },
});

app.mount("#app");
