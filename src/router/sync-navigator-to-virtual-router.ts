import type { Router } from 'vue-router';
import { markRaw } from 'vue';

type Params = {
  navigatorRouter: Router;
  virtualRouter: Router;
};

export const syncNavigatorToVirtualRouter = ({ navigatorRouter, virtualRouter }: Params): void => {
  const stackRoutes = markRaw(
    navigatorRouter.getRoutes().filter((route) => !!route.components?.stackView),
  );

  navigatorRouter.afterEach(async (to, _from, failure) => {
    if (failure) {
      return;
    }

    const isNavigationToStackViewRoute = stackRoutes.map((route) => route.name).includes(to.name);

    if (!isNavigationToStackViewRoute) {
      const itsNotTheSameRoute = virtualRouter.currentRoute.value.fullPath === to.fullPath;

      if (!itsNotTheSameRoute) {
        await virtualRouter.replace(to.fullPath);
      }

      return;
    }

    const currentVirtualRouteIsAlreadyIsRoot = virtualRouter.currentRoute.value.matched.some(
      (route) => route.meta.isRoot,
    );
    if (currentVirtualRouteIsAlreadyIsRoot) {
      return;
    }

    const navigatorRouteRootTo = to.matched.find(
      (route) => !route.components?.stackView && route.meta.isRoot,
    );

    if (navigatorRouteRootTo) {
      await virtualRouter.replace({
        name: navigatorRouteRootTo.name,
        params: to.params,
        query: to.query,
        hash: to.hash,
      });
      return;
    }

    await virtualRouter.replace({
      name: 'home',
    });
  });
};
