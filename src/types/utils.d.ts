declare namespace Utils {
    export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
}
