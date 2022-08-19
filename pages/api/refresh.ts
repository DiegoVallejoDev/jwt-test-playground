// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../src/jwt";
import { timeStamp, minutes} from "../../src/timingUtils";
import { config } from '../../src/sessionconfig';
import { JWTdecode } from "../../src/JWTdecode";

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

  const {  payload, signature  } = JWTdecode(token);
  const { payload: refreshPayload } = JWTdecode(refreshToken);
  
  const jwt = new JWT(key);
  const valid =
    jwt.verify_no_exp(token) &&
    jwt.verify(refreshToken) &&
    refreshPayload.accessTokenSign === signature;
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
  const {signature: newSignature} = JWTdecode(newToken);
  const newRefreshToken = jwt.sign({
    accessTokenSign: newSignature,
    refresh: true,
    exp: timeStamp(new Date(), minutes(config.REFRESH_TIMEOUT_MINUTES)),
    iat: timeStamp(new Date()),
  });
  res.status(200).json({ jwt: newToken, refreshToken: newRefreshToken });
}
