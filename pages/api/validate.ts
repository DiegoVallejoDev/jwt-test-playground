// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../src/jwt";
import { config } from "../../src/sessionconfig";

type Data = {
  valid: string;
  reason?: string;
};
const key = config.secret;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ valid: "false", reason: "Token not found" });
    return;
  }
  token = token.replace("Bearer ", "");
  console.log("Token:", token);
  const jwt = new JWT(key);
  const valid = jwt.verify(token) ? "true" : "false";
  console.log("Valid:", valid);
  res.status(200).json({ valid });
}
