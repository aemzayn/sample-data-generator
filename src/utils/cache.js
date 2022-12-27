export function setCache(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
