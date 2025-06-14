import type {
  NavigationGuard,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from 'vue-router';

type NavigationGuardParams = {
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  next: NavigationGuardNext;
};

const nextFactory = (
  context: NavigationGuardParams,
  middlewares: NavigationGuard[],
  index: number,
): NavigationGuardNext => {
  const subsequentMiddleware: NavigationGuard = middlewares[index];

  if (!subsequentMiddleware) {
    return context.next;
  }

  return (param?: unknown): unknown => {
    if (param) {
      return context.next(param);
    }

    const nextMiddleware: NavigationGuardNext = nextFactory(context, middlewares, index + 1);

    return subsequentMiddleware(context.to, context.from, nextMiddleware);
  };
};

export const middlewarePipeline: NavigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const middlewares: NavigationGuard[] = to.matched.reduce<NavigationGuard[]>(
    (middlewares: NavigationGuard[], record: RouteRecordNormalized) => {
      if (record?.meta?.middlewares?.length) {
        middlewares = middlewares.concat(record.meta.middlewares);
      }
      return middlewares;
    },
    [],
  );

  if (!middlewares || !middlewares.length) {
    return next();
  }

  const context: NavigationGuardParams = { to, from, next };

  return middlewares[0](to, from, nextFactory(context, middlewares, 1));
};
