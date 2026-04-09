export function debounce<T extends (...args: unknown[]) => unknown>(
  cb: T,
  wait = 20,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      cb(...args);
    }, wait);
  };
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
