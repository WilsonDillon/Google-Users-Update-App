import React from 'react';
import { useGoogleAuth } from '../googleAuth';

const LoginButton = () => {
    const { signIn } = useGoogleAuth();
    return (
        <button onClick={signIn} className="google-button">
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img src="https://crossingscommunitychurch.github.io/EmailAssets/google-logo-transparent.png" width="40" alt="" style={{marginLeft: 5 + 'px', marginRight: 5 + 'px',}}/>
                <h2 style={{marginLeft: 10 + 'px', marginRight: 5 + 'px', color: '#737375',}}>Login</h2>
            </div>
        </button>
    );
};

export default LoginButton;