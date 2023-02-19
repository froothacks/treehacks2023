import {httpEndpoint} from "./_generated/server";
import {httpRouter} from "convex/server";

const postMessage = httpEndpoint(async () => {
    return new Response(null, {
        status: 200,

    });
});

const http = httpRouter();

http.route({
    path: "/postMessage",
    method: "GET",
    handler: postMessage,
});


// Convex expects the router to be the default export of `convex/http.js`.
export default http;