import {mutation} from "./_generated/server";
import {Id} from "./_generated/dataModel";

// export default mutation(async ({ db }, body, author) => {
//   const message = { body: body, author: author, test1: "test2" };
//   await db.insert("messages", message);
// });

export const sendMessage = mutation(async ({db}, body, author) => {
    const message = {body, author, format: "text"};
    await db.insert("messages", message);
});

// Generate a short-lived upload URL.
export const generateUploadUrl = mutation(async ({storage}) => {
    return await storage.generateUploadUrl();
});

// Save the storage ID within a message.
export const sendImage = mutation(async ({db}, storageId, author) => {
    const message = {body: storageId, author, format: "image"};
    await db.insert("messages", message);
});

export const createWorksheet = mutation(
    async ({db, storage}, name, teacherID, date, answerID, blankID) => {
        const answerURL = await storage.getUrl(answerID);
        const blankURL = await storage.getUrl(blankID);
        const worksheet = {
            name: name,
            ocr_done: false,
            teacher_id: teacherID,
            date: date,
            answer_url: answerURL,
            blank_url: blankURL,
        };
        const worksheetId = await db.insert("worksheets", worksheet);
        return worksheetId;
    }
);

export const createSubmission = mutation(
    async ({db, storage}, worksheetID, submissionFileID) => {
        // const answerURL = await storage.getUrl(answerID);
        const submissionFileURL = await storage.getUrl(submissionFileID);
        const submission = {
            worksheet_id: worksheetID,
            submission_file_url: submissionFileURL,
        };
        const submissionId = await db.insert("submissions", submission);
        return {submissionId: submissionId.id, submissionFileURL};
    }
);

export const createBoundingBoxes = mutation(
    async ({db}, {worksheetID, box}) => {
        return await db.insert("boundingboxes", {...box, worksheetID})
    }
);

export const markSubmission = mutation(async ({db}, submissionID, feedbacks, totalScore) => {
    const id = new Id("submissions", submissionID)
    return await db.patch(id, {feedbacks, totalScore})
})

export const setTotalScoreWS = mutation(async ({db}, worksheetID, totalScore) => {
    const id = new Id("worksheets", worksheetID)
    return await db.patch(id, {totalScore})
})