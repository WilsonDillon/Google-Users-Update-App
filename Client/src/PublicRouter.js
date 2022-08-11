import React from 'react';
import {Navigate} from 'react-router-dom';
import { useGoogleAuth } from "./googleAuth";
import Login from './Components/Login';

const PublicRouter = () => {

    const { isSignedIn } = useGoogleAuth();
    // const isSignedIn = false;

    return !isSignedIn ? <Login /> : <Navigate exact to="/FileUpload" />
};

export default PublicRouter;