// not using because it looks ugly but it works
export const Table = ({ data }: { data: any; }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).map((key) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{data[key]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
