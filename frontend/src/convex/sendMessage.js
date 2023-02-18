import { mutation } from "./_generated/server";

// export default mutation(async ({ db }, body, author) => {
//   const message = { body: body, author: author, test1: "test2" };
//   await db.insert("messages", message);
// });

export const sendMessage = mutation(async ({ db }, body, author) => {
    const message = { body, author, format: "text" };
    await db.insert("messages", message);
  });

// Generate a short-lived upload URL.
export const generateUploadUrl = mutation(async ({ storage }) => {
    return await storage.generateUploadUrl();
});

// Save the storage ID within a message.
export const sendImage = mutation(async ({ db }, storageId, author) => {
const message = { body: storageId, author, format: "image" };
await db.insert("messages", message);
});
