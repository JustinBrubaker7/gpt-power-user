import React from 'react';
import { useAuth } from '../context/auth-context.jsx';
import Main from '../components/chat/Main.jsx';

export default function Home() {
    const { logout } = useAuth();
    return (
        <div>
            <Main />
        </div>
    );
}
