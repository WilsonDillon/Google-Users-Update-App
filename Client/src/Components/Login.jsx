import React from "react";
// import { Link } from "react-router-dom";
import LoginButton from './LoginButton';
  
function Login() {
  return (
    <div>
      <div>
        <img src="https://crossingscommunitychurch.github.io/EmailAssets/ccc_vert.png" alt = "" width="150" style={{paddingTop: 25 + 'px',}}/>
      </div>
      <div className="body-content">
        <h1 style={{marginLeft: 'auto', marginRight: 'auto',}}>Please log in using your Gmail account:</h1>
        <div>
          <LoginButton/>
        </div>
        {/* <div>
          <ul>
            <li>
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/fileupload">File Upload</Link>
            </li>
          </ul>
        </div> */}
      </div>
      <div className="footer">
        <img src="https://crossingscommunitychurch.github.io/EmailAssets/ccc_lt.png" alt = "" width="150"/>
        <p>
          <small>
            14600 N Portland Ave
          </small>
        </p>
        <p>
          <small>
            Oklahoma City, OK 73134
          </small>
        </p>
      </div>
    </div>
  );
};
  
export default Login;