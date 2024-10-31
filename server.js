const express = require('express')
const app = express()
const mysql = require('mysql2');
const dotenv =require('dotenv')

//configure environment variables 
dotenv.config();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

//test the connection 
db.connect((err) =>  {
   //connection is not successfull
   if (err) { 
    return console.log("Error connecting to the database: ", err)
    }  

    //connection is successfull
    console.log("succesfully connected to MySQL:", db.threadId)

});

//retreive patients 
app.get('',(req, res) => {
  const getPatients = "SELECT patient_id,first_name,last_name,date_of_birth FROM patients"
  db.query(getPatients, (err, data) => {
    //if error
   if(err) {
     return res.status(400).send("failed to get patients",err )
   }

    res.status(200).send(data)
   
  });
});

//retrieve providers 
app.get('',(req, res) => {
  const getProviders = "SELECT first_name,last_name, provider_specialty FROM providers"
  db.query(getProviders, (err, data) => {
    //if error
    if(err) {
      return res.status(400).send("failed to get providers",err )
    }

    res.status(200).send(data)
     
})
})
   
// Filter patients by First Name
app.get('', (req, res) => {
  const { first_name } = req.query;
  const filterPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?"
  db.query(filterPatients, [first_name], (err, data) => {
      if (err) {
          return res.status(400).send("Failed to filter patients by first name: " + err.message)
      }
      res.status(200).send(data)
  })
})

// Retrieve providers by their specialty
app.get('', (req, res) => {
  const { specialty } = req.query;
  const filterProviders = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?"
  db.query(filterProviders, [specialty], (err, data) => {
      if (err) {
          return res.status(400).send("Failed to filter providers by specialty: " + err.message)
      }
      res.status(200).send(data)
  })
})







//listen to the server
const PORT = 3300
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})