export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function createFileObject(
  fileData: string,
  fileName: string,
  mimeType: string,
): File {
  const base64Data = fileData.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  const blob = new Blob([buffer], { type: mimeType });

  return new File([blob], fileName, {
    type: mimeType,
    lastModified: Date.now(),
  });
}
