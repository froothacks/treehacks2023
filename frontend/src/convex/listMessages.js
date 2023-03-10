import {query} from "./_generated/server";
import {Id} from "./_generated/dataModel";

// export default query(async ({ db, storage }) => {
//   const messages = await db.query("worksheets").collect();
//   for (const message of messages) {
//     if (message.format === "image") {
//       message.url = await storage.getUrl(message.body);
//     }
//   }
//   // console.log("MESSAGES FORMAT", messages);

//   const messagesJSON = {}
//   messages.forEach((message, index) => {
//     messagesJSON[index] = message;
//   });
//   // console.log("JSONN", messagesJSON);
//   return messages;
// });

export const getAllWorksheets = query(async ({db, storage}) => {
    const worksheets = await db.query("worksheets").collect();
    // for (const worksheet of worksheets) {
    //     worksheet.answer_url = await storage.getUrl(worksheet.answer_url);
    //     worksheet.blank_url = await storage.getUrl(worksheet.blank_url);
    // }
    return worksheets;
});

export const getWorksheet = query(async ({db}, worksheetID) => {
    return await db.get(new Id("worksheets", worksheetID));
});

export const getAllSubmissions = query(async ({db, storage}) => {
    const submissions = await db.query("submissions").collect();
    // for (const submission of submissions) {
    //     submission.submission_file_url = await storage.getUrl(submission.submission_file_url);
    // }
    return submissions;
});

export const getAllSubmissionsForWorksheet = query(async ({db}, worksheetID) => {
    const submissions = db.query("submissions").filter(q => q.eq(q.field("worksheet_id"), worksheetID)).collect()
    return submissions
})
export const getSubmission = query(async ({db}, submissionID) => {
    return await db.get(submissionID);
});

export const getBB = query(async ({db},worksheetID ) => {
    const submissions = await db.query("boundingboxes").filter(q => q.eq(q.field( "worksheetID"), worksheetID)).collect()
    return submissions
})

export const getWorksheetURLs = query(async ({ db }, worksheetId) => {
  const worksheet = await db.get(worksheetId)
  return worksheet
  // return {answerURL: worksheet?.answer_url, blankURL: worksheet?.blank_url}
});

