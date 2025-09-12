/**
 * 
 * @param {String} path 
 * @param {String} mimeType 
 */
export async function b64Src(path, mimeType) {
  let data = await (await fetch(path)).blob();
  let file = new File([data], undefined, {
    type: mimeType,
  });
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      resolve(`data:${mimeType};base64,${reader.result}`);
    };
    reader.onerror = () => {
      reject();
    };
    reader.readAsDataURL(file);
  });
}
