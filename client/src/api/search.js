const HTTP_URL = import.meta.env.VITE_API_URL;

export const searchManyChats = async (user, searchQuery) => {
    try {
        const response = await fetch(`${HTTP_URL}/search/searchmany?searchQuery=${searchQuery}`, {
            method: 'GET',
            headers: {
                authorization: `${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                error: 'Failed to search chats',
            };
        }

        const chats = await response.json();
        return chats;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to search chats');
    }
};
