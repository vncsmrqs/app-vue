import { type RouteLocationNamedRaw, useLink } from 'vue-router';
import { useAppNavigation } from '@/composables/use-app-navigation.ts';

export const useAppLink = (to: RouteLocationNamedRaw) => {
  const { href, isActive, isExactActive } = useLink({ to });
  const { navigate } = useAppNavigation();

  return {
    href,
    isActive,
    isExactActive,
    navigate: () => navigate(to),
  };
};
