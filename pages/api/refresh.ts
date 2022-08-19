// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../src/jwt";
import { timeStamp, minutes} from "../../src/timingUtils";
import { config } from '../../src/sessionconfig';

type Data = {
  error?: string;
  jwt?: string;
  refreshToken?: string;
};
const key = config.secret;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let token = req.headers.authorization;
  let refreshToken = req.body.refreshToken;
  if (!token) {
    res.status(401).json({ error: "Token not found" });
    return;
  }
  token = token.replace("Bearer ", "");
  console.log("Token:", token);
  console.log("RefreshToken:", refreshToken);

  const [, p, sign] = token.split(".");
  const [, rp] = refreshToken.split(".");
  const payload = JSON.parse(Buffer.from(p, "base64").toString("utf8"));
  const refreshPayload = JSON.parse(Buffer.from(rp, "base64").toString("utf8"));

  const jwt = new JWT(key);
  const valid =
    jwt.verify_no_exp(token) &&
    jwt.verify(refreshToken) &&
    refreshPayload.accessTokenSign === sign;
  console.log("Valid:", valid);

  if (!valid) {
    res.status(401).json({ error: "Refresh token not valid" });
    return;
  }

  const newPayload = {
    id: payload.id,
    name: payload.name,
    iat: timeStamp(new Date()),
    exp: timeStamp(new Date(), minutes(config.SESSION_TIMEOUT_MINUTES)),
  };
  const newToken = jwt.sign(newPayload);
  const [,, newSign] = newToken.split(".");
  const newRefreshToken = jwt.sign({
    accessTokenSign: newSign,
    refresh: true,
    exp: timeStamp(new Date(), minutes(config.REFRESH_TIMEOUT_MINUTES)),
    iat: timeStamp(new Date()),
  });
  res.status(200).json({ jwt: newToken, refreshToken: newRefreshToken });
}
