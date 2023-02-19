import { useMutation } from "src/convex/_generated/react";

export const useUploadImage = () => {
  const generateUploadUrl = useMutation("sendMessage:generateUploadUrl");

  const uploadToStorage = async (ws: any) => {
    if (!ws) return;

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": ws.type },
      body: ws,
    });
    const { storageId } = await result.json();
    console.log({ storageId });
    return storageId;
  };

  return uploadToStorage;
};
