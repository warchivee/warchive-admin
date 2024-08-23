async function resizeImage(
  image: string,
  options: { width: number; height?: number }
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context is null"));
        return;
      }

      let width = options.width || img.width;
      let height = options.height || img.height;

      const aspectRatio = img.width / img.height;

      if (options.width && !options.height) {
        height = Math.floor(width / aspectRatio);
      } else if (!options.width && options.height) {
        width = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Blob is null"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Unexpected reader result type"));
            }
          };
          reader.onerror = () => {
            reject(reader.error || new Error("Unknown reader error"));
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.7 // 이미지 품질
      );
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = image;
  });
}

export default resizeImage;
