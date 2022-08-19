import { JWTdecode } from "../JWTdecode";
import { ExpirationCountdown } from "./ExpirationCountdown";
import { pretifyJson } from "../pretifyJson";

export const JWTInfo = ({ token, name }: { token: string; name?: string; }) => {
    const { header, payload, signature } = JWTdecode(token);

    return (
        <div>
            <h2>{name ? name : "JWT Info"}</h2>
            <hr />
            <div>
                <h3>Headers</h3>
                <pre>
                    <code>{pretifyJson(header)}</code>
                </pre>
                <h3>Payload</h3>
                <pre>
                    <code>{pretifyJson(payload)}</code>
                </pre>
                <div>
                    <h3>
                        Issued at:
                        <div>
                            {payload.iat
                                ? new Date(payload.iat * 1000).toLocaleString()
                                : "No iat field"}
                        </div>
                    </h3>

                    <h3>
                        Expires at:
                        {payload.exp ? (
                            <ExpirationCountdown exp={payload.exp} iat={payload.iat} />
                        ) : (
                            "No iat field"
                        )}
                    </h3>
                </div>

                <hr />

                <h3>Signature</h3>
                <div>{signature}</div>
            </div>
            <h3> raw token:</h3>
            <div> {token} </div>
            <hr />
        </div>
    );
};
