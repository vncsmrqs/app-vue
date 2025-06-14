import type { Router } from 'vue-router';

export const logRouterErrors = (routerName: string, router: Router) => {
  router.afterEach((_to, _from, failure) => {
    if (failure) {
      alert(routerName + '::FAILURE -> ' + failure);
      console.error(`${routerName}::FAILURE`, failure);
    }
  });

  router.onError((error) => {
    alert(routerName + '::ON-ERROR -> ' + error);
    console.error(`${routerName}::ON-ERROR`, error);
  });
};
