const express = require('express');
const app = express();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

app.use(express.json({limit: '50mb'}));

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user',
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/admin.directory.group.member',
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oauth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oauth2Client, callback);
      oauth2Client.setCredentials(JSON.parse(token));
      callback(oauth2Client);
    });
  }
  
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  function getNewToken(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code and scope from the url of that page here: ', (code) => {
      rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth2Client.setCredentials(token);
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

app.put("/updateUsers", (req, res) => {
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.error('Error loading client secret file', err);

    // Updates each user's manager
    function updateUserRelations(auth) {
      const service = google.admin({version: 'directory_v1', auth});
      for (var i = 1 ; i < req.body.length; i++) {
        if (req.body[i].Work_Email.split("@")[1] != "crossings.church") continue;
        else {
          var supervisorName = req.body[i].Supervisor_Primary.toLowerCase().split(",");
          var managerEmail = supervisorName[1].charAt(1) + supervisorName[0] + "@crossings.church";
          if (req.body[i].Work_Email == "{head_honcho}@crossings.church") continue;
          service.users.update({
            userKey: req.body[i].Work_Email,
            requestBody: {
              relations: [{
                value: managerEmail,
                type: 'manager',
            }],
            }
          }, (err, res) => {
            if (err) return console.error('The API returned an error:', err.message);
            const user = res.data;
            console.log(`Updated ${user.name.fullName}'s Manager to: ${user.relations[0].value}`);
          });
        }
      }
    }

    // Updates each user's job title, department, and status (full or part time)
    function updateUserOrganizations(auth) {
      const service = google.admin({version: 'directory_v1', auth});
      for (var i = 1 ; i < req.body.length; i++) {
        if (req.body[i].Work_Email.split("@")[1] != "crossings.church") continue;
        var department = req.body[i].Department_Desc;
        service.users.update({
          userKey: req.body[i].Work_Email,
          requestBody: {
            organizations: [{
              title: req.body[i].Position,
              department: department,
              description: req.body[i].DOL_Status,
              primary: true,
            }]
          },
        }, (err, res) => {
          if (err) return console.error('The API returned an error:', err.message);
          const user = res.data;
          console.log(`Updated ${user.name.fullName}'s Job Title to: ${user.organizations[0].title}, Department to: ${user.organizations[0].department}, and Status to: ${user.organizations[0].description}`);
        });
      }
    }

    // Updates each user's building ID, Floor, and Office Number
    function updateUserLocations(auth) {
      const service = google.admin({version: 'directory_v1', auth});
      for (var i = 1; i < req.body.length; i++) {
        if (req.body[i].Work_Email.split("@")[1] != "crossings.church") continue;
        var building = req.body[i].Location_Desc;
        var floor = req.body[i].Floor_Name;
        var office;
        if (floor != null) office = req.body[i].Floor_Section.toString();
        else office = null;
        service.users.update({
          userKey: req.body[i].Work_Email,
          requestBody: {
            locations: [{
              primary: true,
              type: 'desk',
              area: 'desk',
              buildingId: building,
              floorName: floor,
              floorSection: office,
            }]
          },
        }, (err, res) => {
          if (err) return console.error('The API returned an error:', err.message);
          const user = res.data;
          console.log(`Updated ${user.name.fullName}'s Building ID to: ${user.locations[0].buildingId}, Floor to: ${user.locations[0].floorName}, and Office Number to: ${user.locations[0].floorSection}`);
        });
      }
    }
    
    async function updateWorkPhones(auth) {
      const service = google.admin({version: 'directory_v1', auth});
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      const loop = async () => {
        for (var i = 1; i < req.body.length; i++) {
          if (req.body[i].Work_Email.split("@")[1] != "crossings.church") continue;
          var ext = req.body[i].Work_Phone_Ext
          if (ext == null) {
            service.users.get({
              userKey: req.body[i].Work_Email,
            }, (err, res) => {
              if (err) return console.error('The API returned an error:', err.message);
              var user = res.data
              var phones = user.phones
              if (phones != null) {
                var hasWorkPhone = false;
                for (var j = 0; j < phones.length; j++) {
                  if (phones[j].type == 'work') {
                    hasWorkPhone = true;
                    if (j == phones.length - 1) phones.pop()
                    else phones.splice(j, 1)
                  }
                }
                if (hasWorkPhone == false) console.log(`${user.name.fullName} does not have a work phone.`)
              }
              service.users.update({
                userKey: req.body[i].Work_Email,
                requestBody: {
                  phones: phones,
                }
              }, (err2, res2) => {
                if (err2) return console.error('The API returned an error:', err.message);
                updatedUser = res2.data;
                console.log(i + `: Updated ${updatedUser.name.fullName}'s Work Phone List`);
              })
            })
            await wait(2000)
            continue;
          }
          ext = ext.toString();
          var newNumber;
          if (ext.charAt(0) == '2') newNumber = '111-111-1' + ext
          else if (ext.charAt(0) == '3') newNumber = ext
          else newNumber = '111-111-1' + ext
          service.users.get({
            userKey: req.body[i].Work_Email,
          }, (err, res) => {
            if (err) return console.error('The API returned an error:', err.message);
            var user = res.data
            var phones = user.phones
            if (phones != null) {
              for (var j = 0; j < phones.length; j++) {
                if (phones[j].type == 'work') {
                  if (j == phones.length - 1) phones.pop()
                  else phones.splice(j, 1)
                }
              }
              phones.unshift({ value: newNumber, type: 'work' })
            }
            else phones = [{ value: newNumber, type: 'work' }]
            service.users.update({
              userKey: req.body[i].Work_Email,
              requestBody: {
                phones: phones,
              }
            }, (err2, res2) => {
              if (err2) return console.error('The API returned an error:', err.message);
              updatedUser = res2.data;
              console.log(i + `: Updated ${updatedUser.name.fullName}'s Work Phone to: ${updatedUser.phones[0].value}`);
            })
          })
          await wait(2000)
        }
      }
      loop()
    }
    
    // CHOOSE WHICH FUNCTION TO RUN HERE:
    // Authorize a client with the loaded credentials, then call the Directory API.
      // authorize(JSON.parse(content), updateUserRelations);
      // authorize(JSON.parse(content), updateUserOrganizations);
      // authorize(JSON.parse(content), updateUserLocations);
      // authorize(JSON.parse(content), updateWorkPhones);

  });
});

app.listen(8000, () => { console.log("server started on port 8000") });
