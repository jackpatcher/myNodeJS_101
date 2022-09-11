/**
 *
 * https://www.youtube.com/watch?v=ZjZGczINqe8&t=1787s
 * https://github.com/vitorLostadaC/Node.js--Google-Sheets/blob/main/index.js
 * https://docs.google.com/spreadsheets/d/1KcqDXaQkwgGGw77p4bv3281VTPb8-DUV23msh-3NCHQ/edit#gid=0
 * geradt@s
 * https://medium.com/@sakkeerhussainp/google-sheet-as-your-database-for-node-js-backend-a79fc5a6edd9
*/

 
 const express = require("express");
 const {google} = require("googleapis");

 
 const app = express();

 async function getAuthSheets(){
    const auth = new google.auth.GoogleAuth({
        keyFile : "credentials.json",
        scopes : "https://www.googleapis.com/auth/spreadsheets"
    })

    const client = await auth.getClient();
    const googleSheets = google.sheets({
        version :"v4",
        auth:client
    })

    const spreadsheetId = "1KcqDXaQkwgGGw77p4bv3281VTPb8-DUV23msh-3NCHQ";

    return{
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
 }


app.get("/metadata",async(req,res)=>{
    const {googleSheets,auth,spreadsheetId} = await getAuthSheets();
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,

    });
    res.send(metadata.data);
});

app.get("/getRows",async (req,res)=>{
    const {googleSheets,auth,spreadsheetId} = await getAuthSheets();
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:"Class Data",
    });
    res.send(getRows.data);
});


app.get("/query",async (req,res)=>{
    
    const {std,gender} = req.query;
    const values = [std,gender]; 
    res.send(values ); 
    /**
     * http://localhost:3001/query?std=amp&gender=Male */
});
app.get("/p/:para",async (req,res)=>{
     
    const values = req.params;

    res.send(values.para ); 
     
    /**
     * http://localhost:3001/p/11
     */
});

app.get("/append",async (req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const   datas   = [["A","B"]];

    const row = await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Class Data",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: datas,
      }
    
    });
     
    res.send(JSON.stringify(row.data));
    /**
     * http://localhost:3001/append
     */
});

app.get("/updateRow",async (req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const   datas   = [["A","C"]];

    const row = await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: "Class Data!A36:B36",
      valueInputOption: "USER_ENTERED",
       
      resource: {
        values: datas,
      }
    
    });
     
    res.send(JSON.stringify(row.data));
    /**
     * http://localhost:3001/updateRow
     */
});

app.get("/updateCell",async (req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const   datas   = [["888"]];

    const row = await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: "Class Data!B36",
      valueInputOption: "USER_ENTERED",
       
      resource: {
        values: datas,
      }
    
    }).then(function(resp){
        console.log(resp);
    });
     
    res.send(JSON.stringify(row));
    /**
     * http://localhost:3001/updateCell
     */
});

app.get("/deleteRow",async (req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

 
    
    var batchUpdateRequest = {
        "requests": [
          {
            "deleteDimension": {
              "range": {
                "sheetId": 0, // gid
                "dimension": "ROWS",
                "startIndex": 27,
                "endIndex": 30
              }
            }
          } 
        ]
      }
    try {

    const row = await googleSheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: batchUpdateRequest
      });
   
    } catch(err){
        console.log(err);
    }
    res.send("del done");
  
    //res.send(JSON.stringify(row));
    /** 
     * http://localhost:3001/deleteRow
     * https://developers.google.com/sheets/api/samples/rowcolumn#delete_rows_or_columns
     */
});
 





 app.listen(3001,()=> console.log("Random port 3001"));
