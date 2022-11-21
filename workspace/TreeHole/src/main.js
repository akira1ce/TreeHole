import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./style.css";
import 'element-plus/dist/index.css'

import vue3PhotoPreview from 'vue3-photo-preview';
import 'vue3-photo-preview/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(vue3PhotoPreview);

router.isReady().then(() => app.mount('#app'))
