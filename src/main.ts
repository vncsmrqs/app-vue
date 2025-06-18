import './assets/main.css';
import '@/utils/dayjs.ts';
import 'swiper/css';
import { v6 as uuid } from 'uuid';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { virtualRouter, navigatorRouter, startRouterSync } from './router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';

const app = createApp(App);

app.use(createPinia());

app.use(virtualRouter);

const removeListener = virtualRouter.beforeEach(async () => {
  removeListener();
  const stateId = window.history.state?.stateId || uuid();

  if (PUSH_HISTORY_STATE) {
    await navigatorRouter.replace({
      path: window.location.pathname,
      state: { stateId: stateId },
    });
    return;
  }

  const currentPosition = (navigatorRouter.options.history.state?.position as number) || 0;

  await navigatorRouter.replace({
    path: window.location.pathname,
    state: { stateId, position: currentPosition },
  });
});

app.mount('#app');

startRouterSync();
