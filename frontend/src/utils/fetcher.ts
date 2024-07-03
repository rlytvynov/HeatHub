async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options?.headers,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            if(response.status === 401) {
                const token = localStorage.getItem("token")
                if (token) {
                    localStorage.removeItem("token")
                }
                throw new Error("Unauthorized")
            }
            throw new Error(JSON.stringify({status: response.status, message: errorData.message}));
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}
 export default fetchData