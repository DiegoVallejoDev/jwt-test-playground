import type { NextApiRequest, NextApiResponse } from "next";
import { JWT } from "../../src/jwt";
import { timeStamp, minutes } from "../../src/timingUtils";
import { config } from '../../src/sessionconfig';
import { Users } from "../../src/Users";
import { JWTdecode } from "../../src/JWTdecode";

type Data = {
  jwt?: string;
  error?: string;
  refreshToken?: string;
};

const key = config.secret;
const jwt = new JWT(key);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { username: name, password } = req.body;
  console.log("Login attempt:", name, password);
  const user = Users.find((u) => u.name === name);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    console.log("User not found");
    return;
  }
  if (user.password !== password) {
    res.status(401).json({ error: "Password is incorrect" });
    console.log("Password is incorrect");
    return;
  }
  const payload = {
    id: user.id,
    name: user.name,
    iat: timeStamp(new Date()),
    exp: timeStamp(new Date(), minutes(config.SESSION_TIMEOUT_MINUTES)),
  };
  const token = jwt.sign(payload);
  const {signature} = JWTdecode(token);
  const refreshToken = jwt.sign({
    accessTokenSign: signature,
    refresh: true,
    iat: timeStamp(new Date()),
    exp: timeStamp(new Date(), minutes(config.REFRESH_TIMEOUT_MINUTES)),
  });
  console.log("Token:", token);
  res.status(200).json({ jwt: token, refreshToken });
}
