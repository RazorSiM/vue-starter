import { createApp } from "vue";
import App from "./App.vue";
import BaseLayout from "./layouts/Base.vue";
import EmptyLayout from "./layouts/Empty.vue";
import router from "/@/router";
import { pinia } from "./stores";

import "virtual:windi.css";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.component("BaseLayout", BaseLayout);
app.component("EmptyLayout", EmptyLayout);

app.mount("#app");
