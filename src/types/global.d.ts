declare const getBasePath: () => string;
declare const isDemoInstance: () => boolean;

declare type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

declare const UI_BUILD_DATE: number;
declare const UI_VERSION: string;

declare module '*.png';
declare module '*.jpg';
declare module '*.ico';
declare module '*.svg';
