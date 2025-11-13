// import cors from "cors";

// export const corsMiddleware = cors({
//   origin: process.env.FE_ORIGIN
//     ? [process.env.FE_ORIGIN]
//     : ["http://localhost:3000"],
//   credentials: true,
// });

import cors from "cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:5173"],
  credentials: true,
});
