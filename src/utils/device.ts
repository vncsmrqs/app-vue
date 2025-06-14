export const isIos = () => navigator.userAgent.match(/(iPhone|iPod|iPad)/)?.length;
export const isAndroid = () => navigator.userAgent.match(/(Android)/)?.length;
export const isMobile = () =>
  !!navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/)
    ?.length;
export const isResponsive = () => !isMobile();

export const isLandscape = () =>
  isMobile() && window.matchMedia('(orientation: landscape)').matches;

const displayMode = (() => {
  if (document.referrer.startsWith('android-app://')) return 'twa'; // Trusted Web Activity
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
  if ((window.navigator as Navigator & { standalone?: boolean }).standalone) return 'standalone';
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
  return 'browser';
})();

export const isApp = () => displayMode === 'standalone';

export const isIosApp = () => isIos() && isApp();
export const isIosBrowser = () => isIos() && !isApp();
export const isAndroidApp = () => isAndroid() && isApp();
export const isAndroidBrowser = () => isAndroid() && !isApp();
export const isMobileApp = () => isMobile() && isApp();
export const isMobileBrowser = () => isMobile() && !isApp();
export const isResponsiveApp = () => isResponsive() && isApp();
export const isResponsiveBrowser = () => isResponsive() && !isApp();

export default {
  isApp, // está instalado como aplicativo
  isMobile,
  isMobileApp,
  isMobileBrowser,
  isIos,
  isIosApp,
  isIosBrowser,
  isAndroid,
  isAndroidApp,
  isAndroidBrowser,
  isResponsive,
  isResponsiveApp,
  isResponsiveBrowser,
  isLandscape,
};
