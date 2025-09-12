/**
 * 
 * @param {String} url 
 */
export async function fromUrl(url) {
  return await (await fetch(url)).text();
}