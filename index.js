const express = require('express');
const cors = require('cors')
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        // await client.connect();
        console.log('successfully connected to mongo');

        const listingDB = client.db('listingDB');
        const listingCollection = listingDB.collection('listing');
        const ordersCollection = listingDB.collection('orders')
        const addListingCollection = listingDB.collection('addListing')





        // get api recent 6 
        app.get('/recent-listing', async (req, res) => {
            const cursor = listingCollection.find().sort({ createdAt: -1 }).limit(6)
            const result = await cursor.toArray();
            res.send(result)
        });

        // get elemnt by id
        app.get('/listing/:id', async (req, res) => {
            const id = req.params
            console.log(id);

            const query = { _id: new ObjectId(id) }
            const result = await listingCollection.findOne(query)
            res.send(result)

        })

        // get all order data
        app.get('/my-orders', async (req, res) => {
            const { email } = req.query
            const query = {email: email}
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray();
            res.send(result)
        })

  

        //   get all listing data 
        app.get('/listing', async (req, res) => {
            const { category, email } = req.query
            console.log(category, email);

            const query = {}
            if (category) {
                query.category = category
            }
            if (email) {
                query.email = email;
            }

            // const cursor = listingCollection.find(query)
            const result = await listingCollection.find(query).sort({createdAt: -1}).toArray();
            res.send(result)
        });


        // my listing only listing by logged in user
        app.get('/my-listing', async (req, res) => {
            const { email } = req.query
            const query = { email: email }
            const result = await listingCollection.find(query).toArray()
            res.send(result)
        })

        // post order 
        app.post('/orders', async (req, res) => {
            const data = req.body;
            console.log(req.body);
            const result = await ordersCollection.insertOne(data);
            res.send(result)
        })

        // post Add Listing to 'listing' collection
        app.post('/add-listing', async (req, res) => {
            const data = req.body;
            const date = new Date();
            data.createdAt = date;
            console.log(data);
            const result = await listingCollection.insertOne(data);
            res.send(result)
        })


        // put Update My Listing
        app.put('/update/:id', async (req, res) => {
            const data = req.body
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const updatedInfo = { $set: data }
            const result = await listingCollection.updateOne(query, updatedInfo)
            res.send(result)
        })

        // Dlete Listing
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params
            const query = { _id: new ObjectId(id) }
            const result = await listingCollection.deleteOne(query)
            res.send(result)
        })


        // await client.db("admin").command({ ping: 1 });
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