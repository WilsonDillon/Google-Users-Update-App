import React from 'react';
import LogoutButton from './LogoutButton';
import * as xlsx from 'xlsx';

const FileUpload = () => {
  var sheet = '';

  function Submitted () {
    fetch('/updateUsers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheet),
    }).then(
      response => response.json()
    )
    alert("Thank you for submitting the file. You may log out now.");
  }
  const onChange = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          xlsx.utils.sheet_add_aoa(worksheet, [[
            "Legal_Lastname",	
            "Legal_Firstname",	
            "Position",	
            "DOL_Status",	
            "Benefits_Eligibility_Profile", 
            "Department_Desc", 
            "Location_Desc",	
            "Work_Email",	
            "Supervisor_Primary",	
            "Supervisor_Secondary", 
            "Supervisor_Tertiary", 
            "Floor_Name", 
            "Floor_Section",
            "Work_Phone_Ext",
          ]], { origin: "A1" });
          sheet = xlsx.utils.sheet_to_json(worksheet);
          console.log(sheet);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }
  return (
    <div>
      <div>
        <img src="https://crossingscommunitychurch.github.io/EmailAssets/ccc_vert.png" alt="Your_Header_Image_Here" width="150" style={{paddingTop: 25 + 'px',}}/>
      </div>
      <div className="body-content">
        <h1 style={{marginLeft: 'auto', marginRight: 'auto',}}>Please select a spreadsheet to upload:</h1>
        <form onSubmit={Submitted}>
          <input type="file" id="sheet" name="sheet" required accept=".xls, .xlsx, .xlsm" onChange={onChange} style={{paddingLeft: 20 + 'px', paddingBottom: 15 + 'px', fontSize: 1 + 'em',}}/><br/>
          <input type="submit" style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50 + 'px', fontSize: 1.5 + 'em',}}/>
        </form>
      </div>
      <div style={{display: 'flex', justifyContent: 'right', marginLeft: 35 + '%', marginRight: 35 + '%', paddingRight: 50 + 'px', paddingTop: 15 + 'px', fontSize: 1 + 'em',}}>
        <LogoutButton style={{paddingRight: 50 + 'px', paddingTop: 15 + 'px', fontSize: 1 + 'em',}}/>
      </div>
      <div className="footer">
        <img src="https://crossingscommunitychurch.github.io/EmailAssets/ccc_lt.png" alt="Your_Footer_Image_Here" width="150"/>
        <p>
          <small>
            First_Line_of_Address_Here
          </small>
        </p>
        <p>
          <small>
            Second_Line_of_Address_Here
          </small>
        </p>
      </div>
    </div>
  );
};

export default FileUpload;