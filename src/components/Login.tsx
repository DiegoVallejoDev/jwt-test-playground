import { useState } from "react";
import { sha256 } from "../sha256";

export const Login = ({
    setSession, setRefresh,
}: {
    setSession: Function;
    setRefresh: Function;
}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password: sha256(password),
                }),
            });
            const data = await res.json();
            if (data.error) {
                setPassword("");
                setError(data.error);
            } else {
                setSession(data.jwt);
                setRefresh(data.refreshToken);
            }
        } catch (err: any) {
            setPassword("");
            setError(err.message);
        }
        setLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                    setError("");
                    setUsername(e.target.value);
                }} />
            <label htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                }} />
            {error && <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>}
            <button type="submit">{loading ? "Loading..." : "Login"}</button>
        </form>
    );
};
