import { type AllowedComponentProps, computed, markRaw, ref, type VNodeProps } from 'vue';
import type { Component } from 'vue';
import { defineStore } from 'pinia';
import { type AsyncComponentLoader } from 'vue';
import { STACK_VIEW_BASE_TRANSITION_MILLISECOND } from '../../config/stack-view-config.ts';
import type { NavigationAction } from '@/composables/on-after-router-navigate.ts';
import type { RouteLocationNormalizedGeneric } from 'vue-router';
import { type HookFunction, createHook } from '@/utils/hooks.ts';

type ComponentProps<C extends Component> = C extends new (...args: unknown[]) => unknown
  ? Omit<InstanceType<C>['$props'], keyof VNodeProps | keyof AllowedComponentProps>
  : never;

export type StackViewBaseProps = {
  beforeClose: (hook: HookFunction<void[], boolean>) => () => void;
};

export type StackViewBaseEmitters = {
  close: [boolean | void | undefined];
};

export type StackViewState = 'CLOSED' | 'OPENED';
export type StackViewMode = 'MODAL' | 'FULLSCREEN' | 'DRAWER';

export type StackViewProps<C extends Component = Component> = {
  routeFullPath: string;
  routeAction: NavigationAction;
  routePosition: number;
  routeTo: RouteLocationNormalizedGeneric;
  routeFrom: RouteLocationNormalizedGeneric;
  state: StackViewState;
  mode: StackViewMode;
  component: C | AsyncComponentLoader<C>;
  componentProps: ComponentProps<C>;
  canClose: () => Promise<boolean>;
  onBeforeClose: (hook: HookFunction<void[], boolean>) => () => void;
  animate?: boolean;
};

export type AddStackViewParams<C extends Component> = Pick<
  StackViewProps<C>,
  | 'routeFullPath'
  | 'component'
  | 'componentProps'
  | 'routePosition'
  | 'routeAction'
  | 'routeTo'
  | 'routeFrom'
  | 'mode'
>;

export const useStackViewStore = defineStore('stack-view', () => {
  const _stackViewList = ref<StackViewProps[]>([]);

  const stackViewList = computed(() =>
    _stackViewList.value.sort((a, b) => {
      if (a.routePosition > b.routePosition) {
        return 1;
      }
      if (a.routePosition < b.routePosition) {
        return -1;
      }

      return 0;
    }),
  );

  const add = <C extends Component>(payload: AddStackViewParams<C>): StackViewProps => {
    const { addHook: onBeforeClose, execute: canClose } = createHook((): boolean | void => true);

    const stackView: StackViewProps = {
      routeFullPath: payload.routeFullPath,
      routePosition: payload.routePosition,
      routeAction: payload.routeAction,
      state: 'CLOSED',
      mode: payload.mode ?? 'DRAWER',
      component: markRaw(payload.component),
      componentProps: payload.componentProps,
      routeTo: payload.routeTo,
      routeFrom: payload.routeFrom,
      onBeforeClose,
      canClose,
    };

    if (['PUSH', 'FORWARD'].includes(payload.routeAction) || true) {
      _stackViewList.value.push(stackView);
    } else {
      _stackViewList.value.unshift(stackView);
    }

    return stackView;
  };

  const remove = async (
    routeFullPath: string,
    routePosition: number,
    action: NavigationAction,
    animate: boolean = false,
  ): Promise<void> => {
    await hide(routeFullPath, routePosition, action, animate);

    const stackViewIndex = _stackViewList.value.findIndex(
      (stackView) =>
        stackView.routeFullPath === routeFullPath && stackView.routePosition === routePosition,
    );

    _stackViewList.value = _stackViewList.value.filter((_, index) => index !== stackViewIndex);
  };

  const removeMany = async (
    stackViews: {
      routeFullPath: string;
      routePosition: number;
    }[],
    action: NavigationAction,
    animate: boolean = false,
  ): Promise<void> => {
    await Promise.all(
      stackViews.map(({ routeFullPath, routePosition }) => {
        return hide(routeFullPath, routePosition, action, animate);
      }),
    );

    const stackViewIndexList = stackViews.map(({ routeFullPath, routePosition }) => {
      return _stackViewList.value.findIndex((stackView) => {
        return (
          stackView.routeFullPath === routeFullPath && stackView.routePosition === routePosition
        );
      });
    });

    _stackViewList.value = _stackViewList.value.filter(
      (_, index) => !stackViewIndexList.includes(index),
    );
  };

  const clear = async (action: NavigationAction, animate: boolean = true) => {
    await Promise.all(
      _stackViewList.value.map((stackView) => {
        return hide(stackView.routeFullPath, stackView.routePosition, action, animate);
      }),
    );
    _stackViewList.value = [];
  };

  const find = (fullPath: string, routePosition: number) => {
    return _stackViewList.value.find((stackView) => {
      return stackView.routeFullPath === fullPath && stackView.routePosition === routePosition;
    });
  };

  const show = async (
    routeFullPath: string,
    routePosition: number,
    action: NavigationAction,
    animate: boolean = false,
  ) => {
    const stackView = find(routeFullPath, routePosition);
    if (stackView) {
      stackView.animate = animate;
      stackView.routeAction = action;
      stackView.state = 'OPENED';

      if (animate) {
        await new Promise<void>((resolve) => setTimeout(resolve, getTransitionTime(stackView)));
      }
    }
  };

  const hide = async (
    routeFullPath: string,
    routePosition: number,
    action: NavigationAction,
    animate: boolean = false,
    animationTime?: number,
  ) => {
    const stackView = find(routeFullPath, routePosition);
    if (stackView) {
      stackView.animate = animate;
      stackView.routeAction = action;
      stackView.state = 'CLOSED';

      if (animate) {
        const calculatedAnimationTime = getTransitionTime(stackView, animationTime);

        await new Promise<void>((resolve) => setTimeout(resolve, calculatedAnimationTime));
      }
    }
  };

  const getTransitionTime = (stackView: StackViewProps, animationTime?: number) => {
    if (stackView.animate) {
      return animationTime ? animationTime : STACK_VIEW_BASE_TRANSITION_MILLISECOND;
    }
    return 0;
  };

  const blockBodyScroll = computed(() => {
    return _stackViewList.value.some((stackView) => stackView.state === 'OPENED');
  });

  return {
    stackViews: stackViewList,
    blockBodyScroll,
    add,
    remove,
    removeMany,
    hide,
    show,
    find,
    clear,
    getTransitionTime,
  };
});
