function baseget(obj: any, path: string[] = []) {
  const length = path.length;
  for (let i = 0; i < length; i++) {
    if (obj == null) return null;
    obj = obj[path[i]];
  }
  return length ? obj : null;
}
export function get<T>(object: T, path: string | undefined, defaultValue = '') {
  const value = baseget(object, Array.isArray(path) ? path : path?.split('.'));
  return !String(value) ? defaultValue : value;
}
