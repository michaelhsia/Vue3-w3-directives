// Vue3
import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

// axios 套件
import axios from "axios";

// sweetalert2 套件 -> 預設匯入
import Swal from "sweetalert2";

// API baseUrl
const url = "https://ec-course-api.hexschool.io/v2";

const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    loginPost() {
      axios
        .post(`${url}/admin/signin`, this.user)
        .then((res) => {
          // 把回傳的 token 及 expired timestamp 用解構賦值方式存成同名變數
          const { token, expired } = res.data;

          // 把 token 及 expired 存到 cookie
          document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

          // 登入成功通知
          Swal.fire({
            title: "登入成功",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });

          // 把資料存到 cookie 後，頁面導到商品頁
          // 用 setTimeout 等通知跑完再跳商品頁
          setTimeout(() => (location.href = "index.html"), 1500);
        })
        .catch((err) => {
          // 登入失敗通知
          Swal.fire({
            title: "登入失敗",
            icon: "warning",
            showConfirmButton: false,
            timer: 1000,
          });
        });
    },
  },
});

app.mount("#app");
