import { ref, watch } from 'vue';
import { useRouter } from '@/router';
import type { RouteLocationNamedRaw } from 'vue-router';

const navStack = ref<string[]>([]);

watch(
  () => navStack.value,
  (value) => console.log('navStack', value),
  { deep: true, immediate: true },
);

export function useNavStack() {
  const router = useRouter();

  const pushOrReplace = (fullPath: string, replace = false) => {
    if (replace && navStack.value.length > 0) {
      navStack.value[navStack.value.length - 1] = fullPath;
    } else {
      navStack.value.push(fullPath);
    }
  };
  async function push(to: RouteLocationNamedRaw) {
    const resolvedTo = router.resolve(to);
    const resolvedFrom = router.resolve(current() || '/');

    const isGoingToStackView = !!resolvedTo.matched.toReversed()[0]?.components?.stackView;
    const isComingFromStackView = !!resolvedFrom.matched.toReversed()[0]?.components?.stackView;
    // const isGoingToAnyRootView = resolvedTo.matched.some((route) => route.meta.isRoot);
    const isComingFromAnyRootView = resolvedFrom.matched.some((route) => route.meta.isRoot);
    const isGoingToHome = resolvedTo.name === 'home';

    if (!isGoingToStackView) {
      if (isComingFromStackView) {
        navStack.value = ['/'];
      } else {
        if (isComingFromAnyRootView) {
          const parentsRootList = resolvedTo.matched
            .reverse()
            .filter((parent) => parent.meta.isRoot && parent.name !== to.name);

          const isComingFromParentRootView = parentsRootList.some(
            (parent) => parent.name === resolvedFrom.name,
          );

          if (!isComingFromParentRootView) {
            navStack.value = ['/'];
          }
        }
      }

      if (!isGoingToHome) {
        pushOrReplace(resolvedTo.fullPath, false);
      }

      await router.replace(to);
      return;
    }

    pushOrReplace(resolvedTo.fullPath, to.replace);
    await router.replace(to);
  }

  async function pop() {
    if (navStack.value.length > 1) {
      navStack.value.pop();
      const last: string = navStack.value[navStack.value.length - 1];
      await router.replace(last);

      return;
    }

    navStack.value = ['/'];
    await router.push('/');
  }

  function current() {
    return navStack.value[navStack.value.length - 1];
  }

  return { push, pop, current, navStack };
}
