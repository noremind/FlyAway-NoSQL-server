export function useBlobFiles() {
  const api = useApi();

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadFile = async ({ file, bucket, entityId, scope }) => {
    const response = await api.client({
      url: "/storage/upload",
      method: "post",
      data: {
        bucket,
        entityId,
        scope,
        file: {
          fileName: file.name,
          mimeType: file.type,
          size: file.size,
          base64Data: await fileToBase64(file),
        },
      },
    });

    return response.data;
  };

  const uploadFiles = async ({ files, bucket, entityId, scope }) => {
    const results = [];

    for (const file of files || []) {
      const uploaded = await uploadFile({ file, bucket, entityId, scope });
      results.push(uploaded);
    }

    return results;
  };

  const deleteFiles = async (urls) => {
    const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);

    if (!list.length) return null;

    return api.client({
      url: "/storage/delete",
      method: "post",
      data: {
        urls: list,
      },
    });
  };

  return {
    deleteFiles,
    fileToBase64,
    uploadFile,
    uploadFiles,
  };
}
