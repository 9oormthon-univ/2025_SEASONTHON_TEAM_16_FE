export function genRandomString(len = 32) {
  const bytes = new Uint8Array(len);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ("0" + b.toString(16)).slice(-2)).join("");
}
