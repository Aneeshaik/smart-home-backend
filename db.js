require('dotenv').config()
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGODB_URL

// if (typeof uri !== 'string') {
//     throw new Error("MONGODB_URL must be a string");
// }

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const connectDB = async() => {
    console.log("connectDB called...");
    // console.trace();
    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });  
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(error) {
    console.log("Error connecting to MongoDB", error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

module.exports = connectDB