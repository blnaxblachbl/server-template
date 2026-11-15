import type { Request, Response } from "express";

export async function logoutUser(
  req: Request<any, any, { email: string; password: string }>,
  res: Response,
) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
}
