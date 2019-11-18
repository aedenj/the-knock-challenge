import { createThread, createMessage, getMessagesByThread } from "./thread-controller"


export default [
  {
    path: "/thread",
    method: "post",
    handler: createThread
  },
  {
    path: "/thread/:thread_id/:username",
    method: "post",
    handler: createMessage
  },
  {
    path: "/thread/:thread_id",
    method: "get",
    handler: getMessagesByThread
  }
];

