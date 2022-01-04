const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

app.use(express.json());
app.use(cors());
app.use(express.json());

/* 
user: fixician
pass: 5UKCKFKd7b7CvIq4
*/
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.x89oq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("hello");
});

async function run() {
  try {
    await client.connect();
    console.log("connected to db");
    const fixician = client.db("Fxician");
    const servicesCollection = fixician.collection("services");
    const usersCollection = fixician.collection("users");
    const orderCollection = fixician.collection("usersOrder");
    const reviewCollection = fixician.collection("review");

    app.get("/allServices", async (req, res) => {
      const result = await servicesCollection.find({}).toArray();
      res.json(result);
    });

    //CREATE A DYNMICE PRODUCT API
    app.get("/allServices/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
      // console.log(service);
    });

    // save user
    app.post("/saveUser", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { name: user.name } };
      const option = { upsert: true };
      const result = await usersCollection.updateOne(filter, updateDoc, option);
      res.json(result);
    });

    // save user get
    app.get("/saveUser", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.json(result);
    });

    //Create A users Order Api
    app.post("/usersOrder", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
      // console.log(result);
    });

    //My Order Get Api With Email
    app.get("/usersOrder/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //Delete The Order Api
    app.delete("/deleteOrder/:id", async (req, res) => {
      // console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //POST REVIEW API
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //GET REVIEW API
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
