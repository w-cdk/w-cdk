export const lifecycle = {
  onMounted: [],
  onUpdated: [],
  onBeforeMount: [],
  onBeforeUpdate: [],
  onBeforeDestroy: [],
};

export function onMounted(callback) {
  lifecycle.onMounted.push(callback);
}

export function onUpdated(callback) {
  lifecycle.onUpdated.push(callback);
}

export function onBeforeMount(callback) {
  lifecycle.onBeforeMount.push(callback);
}

export function onBeforeUpdate(callback) {
  lifecycle.onBeforeUpdate.push(callback);
}

export function onBeforeDestroy(callback) {
  lifecycle.onBeforeDestroy.push(callback);
}

export function triggerLifecycleHooks(hook) {
  lifecycle[hook].forEach(callback => callback());
}

export function clearLifecycleHooks() {
  Object.keys(lifecycle).forEach(hook => {
    lifecycle[hook] = [];
  });
}