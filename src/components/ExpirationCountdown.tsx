import { useEffect, useState } from "react";
import { Timer } from "./Timer";

export const ExpirationCountdown = ({ exp, iat }: { exp: number; iat?: number; }) => {
    const [time, setTime] = useState<number>(exp - Math.floor(Date.now() / 1000));
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((t: number) => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [time]);
    // if exp changes, reset time
    useEffect(() => {
        setTime(exp - Math.floor(Date.now() / 1000));
    }, [exp]);

    return (
        <div>
            {new Date(exp * 1000).toLocaleString()}
            <div>
                <h3>
                    Time left:{" "}
                    {time > 0 ? (
                        <Timer seconds={time} />
                    ) : (
                        <div style={{ color: "red", fontWeight: "bold" }}>expired</div>
                    )}
                </h3>
                {iat && (
                    <span>
                        Token has a set livespan of <Timer seconds={exp - iat} /> minutes
                    </span>
                )}
            </div>
        </div>
    );
};
