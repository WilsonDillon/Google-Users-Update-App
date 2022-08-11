import React from 'react';
import { useGoogleAuth } from '../googleAuth';

const LogoutButton = () => {
    const { signOut } = useGoogleAuth();
    return (
        <button onClick={signOut} style={{fontSize: 1 + 'em',}}>Logout</button>
    );
};

export default LogoutButton;