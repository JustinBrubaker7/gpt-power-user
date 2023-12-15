export async function login(formData) {
    console.log(formData, 'login');

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        console.log(response, 'response');
        if (response.ok) {
            console.log(response, 'response');
            const data = await response.json();
            console.log(data, 'data');
            if (data) {
                // Set the current user's auth token
                return {
                    data: data,
                    error: null,
                };
            }
        } else {
            return {
                data: null,
                error: 'Invalid credentials',
            };
        }
    } catch (error) {
        console.error('Error occurred during login:', error);
        return {
            data: null,
            error: 'Internal server error',
        };
    }
}

export async function register(formData) {
    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email, password: formData.password, username: formData.username }),
        });

        if (response.ok) {
            return true; // Registration successful
        } else {
            return false; // Registration failed
        }
    } catch (error) {
        console.error('Error occurred during registration:', error);
        return false; // Registration failed
    }
}
