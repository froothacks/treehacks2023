import { mutation } from "./_generated/server";

export default mutation(async ({ db }, body, author) => {
  const message = { body: body, author: author, test1: "test2" };
  await db.insert("messages", message);
});
