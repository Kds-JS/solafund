export async function storeFile(
  file: File,
  name: string,
): Promise<{
  result: { IpfsHash: string; PinSize: number; Timestamp: string } | null;
  errors: string | null;
}> {
  try {
    const data = new FormData();
    data.append('file', file);
    const pinataMetadata = JSON.stringify({
      name,
    });
    data.append('pinataMetadata', pinataMetadata);

    const upload = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: data,
      },
    );
    const uploadRes = await upload.json();
    return { result: uploadRes, errors: null };
  } catch (error: any) {
    console.log(error);
    return { result: null, errors: error.message };
  }
}
