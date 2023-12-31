const HTTP_URL = import.meta.env.VITE_API_URL;

export const getAllShortCuts = async (user) => {
    console.log('userId', user);
    try {
        const response = await fetch(`${HTTP_URL}/shortcut/getallshortcuts?userId=${user.userId}`, {
            method: 'GET',
            headers: {
                authorization: `${user.token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return {
                error: 'Failed to fetch shortcuts',
            };
        }

        const shortcuts = await response.json();
        return shortcuts.shortcuts;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch shortcuts');
    }
};
