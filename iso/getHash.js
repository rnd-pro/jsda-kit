/**
 * 
 * @param {String} str 
 * @returns {Promise<String>}
 */
export async function getHash(str) {
  let encoder = new TextEncoder();
  let data = encoder.encode(str);
  let isoCrypto;
  if (typeof window === 'undefined') {
    isoCrypto = await import('crypto');
  } else {
    isoCrypto = window.crypto;
  }
  // @ts-ignore =(
  let hash = await isoCrypto.subtle.digest('SHA-1', data);
  let u8 = new Uint8Array(hash);
  let hashString = Array.from(u8).map((b) => {
    return b.toString(16).padStart(2, '0');
  }).join('');
  return hashString;
}