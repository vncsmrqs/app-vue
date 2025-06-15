import './assets/main.css';
import '@/utils/dayjs.ts';
import 'swiper/css';
import { v6 as uuid } from 'uuid';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { virtualRouter, navigatorRouter, startRouterSync } from './router';

const app = createApp(App);

app.use(createPinia());

app.use(virtualRouter);

const removeListener = virtualRouter.beforeEach(async () => {
  removeListener();
  const stateId = window.history.state?.stateId;
  await navigatorRouter.replace({
    path: window.location.pathname,
    state: { stateId: stateId?.length ? stateId : uuid() },
  });
});

app.mount('#app');

startRouterSync();
