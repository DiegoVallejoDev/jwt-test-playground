export const Logout = ({ setSession }: { setSession: Function; }) => {
    const handleLogout = async (e: any) => {
        e.preventDefault();
        setSession(null);
    };
    return (
        <form onSubmit={handleLogout}>
            <button type="submit">Logout</button>
        </form>
    );
};
