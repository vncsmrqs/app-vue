<script setup lang="ts">
import { type StackViewProps, useStackViewStore } from '@/stores/stack-view-store.ts';
import { defineAsyncComponent, onMounted, watch } from 'vue';
import DrawerStackView from '@/components/Stack/DrawerStackView.vue';
import { type AsyncComponentLoader } from 'vue';
import { onAfterRouterNavigate } from '@/composables/on-after-router-navigate.ts';
import { useAppNavigation } from '@/composables/use-app-navigation.ts';
import { isMobileBrowser } from '@/utils/device.ts';
import { useRouter } from '@/router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import { useNavStack } from '@/composables/use-nav-stack.ts';

const router = useRouter();
const stackViewStore = useStackViewStore();
const { navigate } = useAppNavigation();

onAfterRouterNavigate(async (payload) => {
  const { to, from, action, currentPosition, backwardRouteList } = payload;

  const routeTo = to.matched[to.matched.length - 1];
  const stackViewComponentTo = routeTo?.components?.stackView;
  const isNavigatingToStackViewRoute = !!stackViewComponentTo;

  const toFullPath: string | null = to.fullPath;

  if (!isNavigatingToStackViewRoute) {
    const isGoingToAppLayout = to.matched.some(({ name }) => name === 'app-layout');
    const animate = !isMobileBrowser() && action === 'BACKWARD' && isGoingToAppLayout;
    await stackViewStore.clear(action, animate);
  }

  if (action === 'BACKWARD') {
    await stackViewStore.removeMany(
      backwardRouteList.map((r) => ({ routeFullPath: r.fullPath, routePosition: r.position })),
      action,
      !isMobileBrowser(),
    );
  }

  if (isNavigatingToStackViewRoute) {
    const alreadyExists = !!stackViewStore.find(to.fullPath, currentPosition);

    if (!alreadyExists) {
      stackViewStore.add({
        routeFullPath: to.fullPath,
        component: stackViewComponentTo,
        componentProps: to.params,
        routePosition: currentPosition,
        routeAction: action,
        routeTo: to,
        routeFrom: from,
        mode: to.meta.mode || 'DRAWER',
      });
    }

    await stackViewStore.show(
      toFullPath,
      currentPosition,
      action,
      !isMobileBrowser() || action === 'PUSH',
    );
  }
});

watch(
  () => stackViewStore.blockBodyScroll,
  (blockBodyScroll) => {
    if (blockBodyScroll) {
      return (document.body.style.overflow = 'hidden');
    }
    return (document.body.style.overflow = 'auto');
  },
);

const hideStackViewBeforeNavigate = async (stackView: StackViewProps, animationTime?: number) => {
  return await stackViewStore.hide(
    stackView.routeFullPath,
    stackView.routePosition,
    'BACKWARD',
    true,
    animationTime,
  );
};

const navStack = useNavStack();

const navigateBack = async (stackView?: StackViewProps) => {
  if (PUSH_HISTORY_STATE) {
    await router.back();
    return;
  }

  await navStack.pop();
  // await navigate({
  //   name: stackView?.routeFrom.name || 'home',
  //   replace: true,
  //   params: stackView?.routeFrom.params,
  //   query: stackView?.routeFrom.query,
  //   hash: stackView?.routeFrom.hash,
  // });
};

const closeStackView = async (
  { routeFullPath, routePosition }: StackViewProps,
  hideBeforeNavigate = true,
  animationTime?: number,
): Promise<void> => {
  const stackView = stackViewStore.find(routeFullPath, routePosition);

  if (stackView) {
    const isFirstNavigation =
      stackView.routeFrom.fullPath === stackView.routeFullPath || !stackView.routeFrom.name;

    if (isFirstNavigation) {
      const rootTo = stackView.routeTo.matched.find((route) => route.meta.isRoot);

      if (hideBeforeNavigate) {
        await hideStackViewBeforeNavigate(stackView, animationTime);
      }

      await navigate({
        name: rootTo?.name || 'home',
        replace: true,
        params: stackView?.routeFrom.params,
        query: stackView?.routeFrom.query,
        hash: stackView?.routeFrom.hash,
      });

      return;
    }

    if (hideBeforeNavigate) {
      await hideStackViewBeforeNavigate(stackView, animationTime);
    }
  }

  await navigateBack(stackView);
};

const defineComponent = (stackView: StackViewProps) => {
  return stackView.component instanceof Function
    ? defineAsyncComponent(stackView.component as AsyncComponentLoader<typeof stackView.component>)
    : stackView.component;
};

onMounted(() => {});
</script>

<template>
  <div>
    <template
      v-for="(stackView, index) in stackViewStore.stackViews"
      :key="`stack-view-${stackView.routePosition}-${stackView.routeFullPath}`"
    >
      <DrawerStackView
        :show="stackView.state === 'OPENED'"
        :index="index"
        :transition-duration="stackViewStore.getTransitionTime(stackView)"
        @close="
          async (animationTime) => {
            if (await stackView.canClose()) {
              await closeStackView(stackView, true, animationTime);
            }
          }
        "
      >
        <component
          :is="defineComponent(stackView)"
          v-bind="stackView.componentProps"
          :before-close="stackView.onBeforeClose"
          @close="(hideBeforeNavigate?: boolean) => closeStackView(stackView, hideBeforeNavigate)"
        />
      </DrawerStackView>
    </template>
  </div>
</template>

<style scoped></style>
