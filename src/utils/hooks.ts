export type HookFunction<Args extends unknown[], Result> = (...args: Args) => Result;

const defaultValidationFunction = (result: unknown) => {
  return result !== false;
};

export function createHook<HArgs extends unknown[], HResult>(
  firstHook: HookFunction<HArgs, HResult>,
  validationFunction: (result: HResult) => boolean | void = defaultValidationFunction,
) {
  let hooks: HookFunction<HArgs, HResult>[] = [firstHook];

  const addHook = (hook: HookFunction<HArgs, HResult>) => {
    hooks.push(hook);
    return () => {
      removeHook(hook);
    };
  };

  const removeHook = (hook: HookFunction<HArgs, HResult>) => {
    hooks = hooks.filter((h) => h !== hook);
  };

  const execute = async (...args: HArgs) => {
    for (const hook of hooks) {
      const result = validationFunction(await hook(...args));

      if (result === false) {
        return false;
      }
    }
    return true;
  };

  return { addHook, removeHook, execute };
}
