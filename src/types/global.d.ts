declare const getBasePath: () => string;

declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;