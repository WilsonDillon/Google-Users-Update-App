import React from 'react';
import {Navigate} from 'react-router-dom';
import { useGoogleAuth } from "./googleAuth";
import FileUpload from './Components/FileUpload';

const PrivateRoute = () => {

    const { isSignedIn } = useGoogleAuth();
    // const isSignedIn = true;

    return isSignedIn ? <FileUpload /> : <Navigate exact to="/" />
};

export default PrivateRoute;