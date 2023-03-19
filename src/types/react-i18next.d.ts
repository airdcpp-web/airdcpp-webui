// i18next.d.ts
import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;

    // Disable typings for the translation keys for now
    //resources: {
    //  main: typeof en
    //}
  }

  // Workaround for https://github.com/isaachinman/next-i18next/issues/1781
  interface TFunction {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    <TKeys extends TFuncKey = string, TInterpolationMap extends StringMap = StringMap>(
      key: TKeys,
      options?: TOptions<TInterpolationMap> | string
    ): string;
  }
}
