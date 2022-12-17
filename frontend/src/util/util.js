export function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader?.result?.split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function getBaseUrl() {
  let urlBase;
  let dominio = window.location.host
  if (process.env.NODE_ENV === "production")
    urlBase = `https://${dominio}/api/v1/`;
  else {
    urlBase = process.env.REACT_APP_URL_BACKEND;
  }
  return urlBase;
}
