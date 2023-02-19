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

export const createWorksheet = mutation(async ({ db, storage }, name, teacherID, date, answerID, blankID) => {
    const answerURL = await storage.getUrl(answerID);
    const blankURL = await storage.getUrl(blankID);
    const worksheet = { name: name, teacher_id: teacherID, date: date, answer_url: answerURL, blank_url: blankURL };
    const worksheetId = await db.insert("worksheets", worksheet);
    return {worksheetId: worksheetId.id, answerURL, blankURL}
});
