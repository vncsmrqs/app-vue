import { type RouteLocationNamedRaw, useLink } from 'vue-router';
import { useAppNavigation } from '@/composables/use-app-navigation.ts';

export const useAppLink = (to: RouteLocationNamedRaw) => {
  const { href, isActive, isExactActive, route } = useLink({ to });
  const { navigate } = useAppNavigation();

  return {
    href,
    isActive,
    isExactActive,
    route,
    navigate: () => navigate(to),
  };
};
