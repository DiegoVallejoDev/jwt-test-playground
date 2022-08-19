import { useEffect, useState } from "react";

export const RefreshSession = ({
    token, refreshToken, setSession, setRefresh,
}: {
    token: string;
    refreshToken: string;
    setSession: Function;
    setRefresh: Function;
}) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setSuccess(false);
        }, 5000);
    }, [success]);
    

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ refreshToken }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setSuccess(true);
                setRefresh(data.refreshToken);
                setSession(data.jwt);
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
                <button disabled={success} type="submit">Refresh Session</button>
            )}
            {error && <span style={{ color: "red", fontWeight: "bold" }}>{error}</span>}
            {success && <span style={{ color: "green", fontWeight: "bold" }}>Success!</span>}
        </form>
    );
};
