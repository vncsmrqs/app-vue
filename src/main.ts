import './assets/main.css';
import '@/utils/dayjs.ts';
import 'swiper/css';
import { v6 as uuid } from 'uuid';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { virtualRouter, navigatorRouter, startRouterSync } from './router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import { useNavStack } from '@/composables/use-nav-stack.ts';

const app = createApp(App);

app.use(createPinia());

app.use(virtualRouter);

const removeListener = virtualRouter.beforeEach(async () => {
  removeListener();
  const stateId = window.history.state?.stateId;

  if (PUSH_HISTORY_STATE) {
    await navigatorRouter.replace({
      path: window.location.pathname,
      state: { stateId: stateId?.length ? stateId : uuid() },
    });
    return;
  }

  const navStack = useNavStack();

  let count = 0;

  setTimeout(() => {
    window.history.pushState({ count }, '', `/`);
  }, 1);

  window.addEventListener('popstate', async () => {
    alert(`popstate::${++count}`);
    setTimeout(() => {
      window.history.pushState({ count }, '', `/`);
    }, 1);
    await navStack.pop();
  });

  const resolvedRoute = navigatorRouter.resolve(window.location.pathname);

  await navStack.push({
    name: resolvedRoute.name || 'home',
    replace: false,
    state: { stateId: stateId?.length ? stateId : uuid() },
  });
});

app.mount('#app');

startRouterSync();
