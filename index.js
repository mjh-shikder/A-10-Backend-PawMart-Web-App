const express = require('express');
const cors = require('cors')
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json())
//




const uri = process.env.MONGO_URI 

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
      await client.connect();
      console.log('successfully connected to mongo');
      
      const listingDB = client.db('listingDB');
      const listingCollection = listingDB.collection('listing');
    const ordersCollection = listingDB.collection('orders')
      
      
      
    // get api recent 6 
      app.get('/recent-listing', async (req, res) => {
          const cursor = listingCollection.find().limit(6)
          const result = await cursor.toArray();
          res.send(result)
      });
      
      //   get signle data by id
      app.get('/listing', async (req, res) => {
          const cursor = listingCollection.find()
          const result = await cursor.toArray();
          res.send(result)
      });

      // post order 
      app.post('/orders', async (req, res) => {
          const data = req.body;
          console.log(req.body);
          const result = await ordersCollection.insertOne(data);
          res.send(result)
        
      })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log(`users server started on port: ${port}`);
    
})