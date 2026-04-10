<script setup lang="ts">
import {
  type StackViewMode,
  type StackViewProps,
  useStackViewStore,
} from '@/stores/stack-view-store.ts';
import { type Component, defineAsyncComponent, onMounted, watch } from 'vue';
import DrawerStackView from '@/components/Stack/DrawerStackView.vue';
import { type AsyncComponentLoader } from 'vue';
import { onAfterRouterNavigate } from '@/composables/on-after-router-navigate.ts';
import { useAppNavigation } from '@/composables/use-app-navigation.ts';
import { isMobileBrowser, isResponsive } from '@/utils/device.ts';
import { useRouter } from '@/router';
import { PUSH_HISTORY_STATE } from '@/config/stack-view-config.ts';
import BottomSheetStackView from '@/components/Stack/BottomSheetStackView.vue';
import CenterModalStackView from '@/components/Stack/CenterModalStackView.vue';

const router = useRouter();
const stackViewStore = useStackViewStore();
const { navigate } = useAppNavigation();

onAfterRouterNavigate(async (payload) => {
  const { to, from, action, currentPosition, lastPosition, backwardRouteList, currentState } =
    payload;

  const routeTo = to.matched[to.matched.length - 1];
  const stackViewComponentTo = routeTo?.components?.default;
  const isNavigatingToStackViewRoute = routeTo.meta.type === 'STACK' && stackViewComponentTo;

  const toFullPath: string | null = to.fullPath;

  if (!isNavigatingToStackViewRoute) {
    const isGoingToAppLayout = to.matched.some(({ name }) => name === 'app-layout');
    //todo: Animate?
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

  if (currentState.replaced) {
    //todo: Await?
    stackViewStore.remove(from.fullPath, lastPosition, 'REPLACE', !isMobileBrowser());
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
        mode: to.meta.stackMode || 'DRAWER',
        props: to.meta.stackProps,
      });
    }

    await stackViewStore.show(
      toFullPath,
      currentPosition,
      action,
      !isMobileBrowser() || ['PUSH', 'REPLACE'].includes(action),
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

const navigateBack = async (stackView?: StackViewProps) => {
  if (PUSH_HISTORY_STATE || stackView?.routeFrom.name) {
    router.back();
    return;
  }

  await navigate({
    name: stackView?.routeFrom.name || 'app',
    replace: true,
    params: stackView?.routeFrom.params,
    query: stackView?.routeFrom.query,
    hash: stackView?.routeFrom.hash,
  });
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
      const rootTo = stackView.routeTo.matched.find((route) => route.meta.type === 'ROOT');

      if (hideBeforeNavigate) {
        await hideStackViewBeforeNavigate(stackView, animationTime);
      }

      await navigate({
        name: rootTo?.name || 'app',
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

const getViewComponent = (stackView: StackViewProps): Component => {
  const componentMap: Record<StackViewMode, Component | undefined> = {
    DRAWER: DrawerStackView,
    BOTTOM_SHEET: isResponsive() ? CenterModalStackView : BottomSheetStackView,
    MODAL: CenterModalStackView,
    FULLSCREEN: undefined,
  };

  return componentMap?.[stackView.mode] ?? DrawerStackView;
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
      <Component
        :is="getViewComponent(stackView)"
        :show="stackView.state === 'OPENED'"
        :index="index"
        :transition-duration="stackViewStore.getTransitionTime(stackView)"
        v-bind="stackView.props"
        @close="
          async (animationTime: number) => {
            if (await stackView.canClose()) {
              await closeStackView(stackView, true, animationTime);
            }
          }
        "
      >
        <component
          :is="defineComponent(stackView)"
          v-bind="stackView.componentProps"
          :stack-view="stackView"
          @close="
            async (hideBeforeNavigate?: boolean) => {
              if (await stackView.canClose()) {
                await closeStackView(stackView, hideBeforeNavigate);
              }
            }
          "
        />
      </Component>
    </template>
  </div>
</template>

<style scoped></style>
