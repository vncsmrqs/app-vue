import './assets/main.css';
import '@/utils/dayjs.ts';
import 'swiper/css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { virtualRouter, navigatorRouter, startRouterSync } from './router';

const app = createApp(App);

app.use(createPinia());

app.use(virtualRouter);

const removeListener = virtualRouter.beforeEach(async () => {
  removeListener();
  await navigatorRouter.replace(window.location.pathname);
});

app.mount('#app');

startRouterSync();
