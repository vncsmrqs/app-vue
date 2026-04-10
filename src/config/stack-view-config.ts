import { isIosApp, isMobile, isMobileApp } from '@/utils/device.ts';

export const STACK_VIEW_BASE_TRANSITION_MILLISECOND = 200;
export const STACK_VIEW_VISIBILITY_TIMEOUT_MILLISECOND = 1;

export const MIN_SWIPE_X_START = 30;

export const PUSH_HISTORY_STATE = !isIosApp();

export const STACK_VIEW_SWIPE_X_IS_ACTIVE = isMobileApp() || true;
export const STACK_VIEW_SWIPE_Y_IS_ACTIVE = isMobile();

export const CONTAINER_OPACITY_IS_ACTIVE = false;
