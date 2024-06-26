async function fetchData<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if(response.status === 401) {
                const token = localStorage.getItem("token")
                if (token) {
                    localStorage.removeItem("token")
                }
                throw new Error(JSON.stringify({id: errorData.id, role: errorData.role, status: 401, message: errorData.message}))
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