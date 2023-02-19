import { query } from "./_generated/server";

export default query(async ({ db, storage }) => {
  const messages = await db.query("worksheets").collect();
  for (const message of messages) {
    if (message.format === "image") {
      message.url = await storage.getUrl(message.body);
    }
  }
  // console.log("MESSAGES FORMAT", messages);

  const messagesJSON = {}
  messages.forEach((message, index) => {
    messagesJSON[index] = message;
  });
  // console.log("JSONN", messagesJSON);
  return messages;
});
