type PayloadMetaAction<T extends string, P = undefined> = P extends undefined ? { type: T } : { type: T; payload: P };

export function action<T extends string, P = undefined>(type: T, payload?: P): PayloadMetaAction<T, P> {
  return { type, payload } as any;
}
