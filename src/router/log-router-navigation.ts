import type { Router } from 'vue-router';

export const logRouterNavigation = (routerName: string, router: Router) => {
  router.beforeEach((to, from, next) => {
    console.log(`
${routerName}::START
  FROM: ${from.fullPath}
  TO: ${to.fullPath}
  `);
    next();
  });

  router.afterEach((to, from, next) => {
    console.log(`
${routerName}::END
  FROM: ${from.fullPath}
  TO: ${to.fullPath}
  `);
  });
};
