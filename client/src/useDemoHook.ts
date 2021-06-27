type DemoHook = {
  demoPromise: () => Promise<string>;
};

export const useDemoHook = (): DemoHook => {
  const demoPromise = (): Promise<string> => {
    if (Date.now() > 0) {
      return Promise.resolve("Greater than 0");
    } else if (Date.now() < 0) {
      return Promise.resolve("Less than 0");
    }
    /** The following code is a duplication of the first condition */
    // else if (Date.now() > 0) {
    //   return Promise.resolve('Greater than 0, again')
    // }
    return Promise.resolve("default");
  };

  return { demoPromise };
};
