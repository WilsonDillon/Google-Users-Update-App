# Getting Started with Google Users Update

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## What this app does:

This app was designed to read a spreadsheet downloaded from **PayCom**, convert it to **JSON**, and use it to update the specified user fields in the **Google Admin SDK API**. 

## Pre-Requisites:

1. Built with Node v16.15.1 and Yarn v1.22.19
2. Create a google project in the google developer console.
3. Download the credentials file and rename it `credentials.json`. 
4. Place it in the `Server` folder. The `.gitignore` file should automatically ignore it so your credentials are not stored on github.

## Steps to run:

1. Install with `yarn` (not `npm`) in both the `Client` and `Server` folders.
2. Add a `.env` file in `Client`. It should have one line : `REACT_APP_CLIENT_ID = {YOUR_CLIENT_ID}`.
3. Run `yarn start` in both the `Client` and `Server` folers. You will have to open a second terminal.
4. Login to the site with your google account within the domain that the project was created for (it should redirect to the `File Upload` page).
5. In the `onChange()` function in `FileUpload.jsx`, modify the headers to correspond to whichever row of the spreadsheet contains your headers. These will be the properties you can reference when the spreadsheet is converted to `json`.
6. Look in the `server.js` file, modify whichever functions you need to in order to reference the correct properties/headers in the `.xlsx` file, and comment out whichever functions you don't want to call to update user profiles. Additionally, add or modify any specifics that correspond to properties such as your *domain, building IDs, emails, departments, etc*.  

    The functions to modify are:
    - `updateUserRelations()`
    - `updateUserOrganizations()`
    - `updateUserLocations()`    
    - `updateWorkPhones()`

    The functions that actually run the program are:
    - `authorize(JSON.parse(content), updateUserRelations)`
    - `authorize(JSON.parse(content), updateUserOrganizations)`
    - `authorize(JSON.parse(content), updateUserLocations)`
    - `authorize(JSON.parse(content), updateWorkPhones)`

    >**TIP:** I recommend testing each function on one user and checking the outcome before running a bulk update. This assures that all the desired properties are being updated correctly. 

7. Follow the instructions to obtain a token with the correct oauth2 credentials for the Google Admin Console. A `token.json` file containing an access token should be created in the `Server` folder. It is also ignored by the `.gitignore` file.

    >**Note:** Be sure to copy the *code* as well as the *scope* from the url on the redirect page. <br>
    >
    >**Example:** If the url is `https://www.google.com/?code=thisisacode&scope=thisisascope`, copy `thisisacode&scope=thisisascope`. <br>
    >
    >**Extra TIP:** If you get a `Malformed auth code` error, read the example above and try again. If that doesn't work, go into your Google Account Settings>Security>Third party apps with account access. Remove access from your Google project, restart the server, and try again. 

8. Upload the desired spreadsheet.

    >You may want to run a few tests on single users before updating them all, just in case the formatting of the spreadsheet is different than the original spreadsheet this app was designed to read. 

9. Submit the spreadsheet.
10. Check the terminal to see the log of what was updated.
11. For any continued use or general professionalism, fill in the urls for your company logos, as well as the information for the footer. These areas are found on the *client side* in the `Login.jsx` and `FileUpload.jsx` pages.