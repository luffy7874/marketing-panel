export const fetchApiData = async (url: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data =  response.json();
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}