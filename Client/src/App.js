import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRouter />} />
        <Route path="/fileupload" element={<PrivateRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;