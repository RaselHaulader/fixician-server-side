const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

app.use(express.json());
app.use(cors());
app.use(express.json());

/* 
user: fixician
pass: 5UKCKFKd7b7CvIq4
*/
const uri = `mongodb+srv://fixician:5UKCKFKd7b7CvIq4@cluster0.x89oq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello')
  })
  
  async function run() {
    try {
      await client.connect();
      console.log('connected to db');
      const fixician = client.db("Fxician");
      const servicesCollection =  fixician.collection('services')
      
      app.get('/allServices', async (req, res) => {
        const result = await servicesCollection.find({}).toArray();
        res.json(result);
      })
  
    } finally {
  
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send('hello')
  })
  


  app.listen(port, () => {
    console.log('listening to port', port)
  })