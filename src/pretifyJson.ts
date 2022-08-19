export const pretifyJson = (json: (string | object)) => {
    const jsonString = typeof json === "string" ? json : JSON.stringify(json, null, 2);
    return JSON.stringify(JSON.parse(jsonString), null, 2);
};
