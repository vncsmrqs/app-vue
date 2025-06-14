export function debounce<T extends Function>(cb: T, wait = 20) {
  let h: any = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

export const timeout = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export function changeThemeColor(color: string): void {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

export function updateThemeColor(darkColor = '#000000', lightColor = '#FFFFFF') {
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const themeColor = isDarkMode ? darkColor : lightColor;
  changeThemeColor(themeColor);
}
