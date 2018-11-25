declare const getBasePath: () => string;

declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

declare type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

declare const UI_BUILD_DATE: string;
declare const UI_VERSION: string;

declare module '*.png'
declare module '*.jpg'
declare module '*.ico'