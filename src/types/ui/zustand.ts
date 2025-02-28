import { Getter, LensContext, ResolveStoreApi, Setter } from '@dhmk/zustand-lens';

export type PartialLensSlice<
  L,
  T extends L,
  S = unknown,
  SetterFn = Setter<T>,
  Ctx = LensContext<L, S>,
> = (
  set: SetterFn,
  get: Getter<T>,
  api: ResolveStoreApi<S>,
  ctx: Ctx,
) => L /*& LensMeta<T, S>*/;
