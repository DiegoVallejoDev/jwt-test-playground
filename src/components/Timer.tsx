
export const Timer = ({ seconds }: { seconds: number; }) => {
    // return seconds in minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return (
        <span>
            {minutes}:{secondsLeft < 10 ? ("0" + secondsLeft.toString()) : secondsLeft}
        </span>
    );
};
