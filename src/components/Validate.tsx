import { useEffect, useState } from "react";

export const Validate = ({ token }: { token: string; }) => {
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    useEffect(() => {
        //clear msg and error after 5 seconds
        const timer = setTimeout(() => {
            setMsg("");
            setError("");
        }, 5000);
        return () => clearTimeout(timer);
    }),
        [msg, error];
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ petition: "validate" }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setLoading(false);
                data.valid == "true"
                    ? setMsg("Token is valid")
                    : setError("Token is invalid");
            }
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <button type="submit" disabled={loading || msg != "" || error != ""}>
                    {loading ? "Loading" : "Validate"}
                </button>
            )}
            {msg && <span style={{ color: "blue", fontWeight: "bold" }}>{msg}</span>}
            {error && (
                <span style={{ color: "red", fontWeight: "bold" }}>{error}</span>
            )}
        </form>
    );
};
