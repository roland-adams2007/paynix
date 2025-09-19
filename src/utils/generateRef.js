export default function generateRef(length = 32) {
  if (length <= 0) return '';
  const digits = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(digits);
    let out = '';
    for (let i = 0; i < length; i++) out += (digits[i] % 10).toString();
    return out;
  }
  let s = '';
  for (let i = 0; i < length; i++) s += Math.floor(Math.random() * 10);
  return s;
}
