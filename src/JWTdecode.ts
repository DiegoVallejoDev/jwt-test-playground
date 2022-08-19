
export const JWTdecode = (token: string) => {
    if (!token) {
        return { header: {}, payload: {}, signature: "" };
    }
    console.log("JWTdecode:", token);
    const [B64header, B64payload, signature] = token.split('.');
    const header = JSON.parse(Buffer.from(B64header, "base64").toString("ascii"));
    const payload = JSON.parse(Buffer.from(B64payload, "base64").toString("ascii"));
    return { header, payload, signature };
}