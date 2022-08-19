const crypto = require("crypto");

export const sha256 = (data: string) => {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};
