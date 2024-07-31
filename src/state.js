export function reactive(initialState) {
  return new Proxy(initialState, {
    set(target, property, value) {
      target[property] = value;
      return true;
    },
  });
}
