import "express-session";

declare module "express-session" {
  interface SessionData {
    accessToken?: string;
    refreshToken?: string;
  }
}
// declare namespace Express {
//   interface CustomSessionFields {
//     accessToken?: string;
//     refreshToken?: string;
//   }

//   export interface Request {
//     session: Session & Partial<SessionData> & CustomSessionFields;
//   }
// }
