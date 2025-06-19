/// <reference types="vite/client" />

import 'vue-router';
import type { NavigationGuard } from 'vue-router';

// To ensure it is treated as a module, add at least one `export` statement
export {};

declare module 'vue-router' {
  export interface RouteMeta {
    type?: 'PAGE' | 'ROOT' | 'STACK';
    mode?: DrawerMode;
    middlewares?: NavigationGuard[];
    permissions?: PermissionEnum[];
  }
}
