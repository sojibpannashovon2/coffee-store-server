const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const express = require('express');

const app = express()

const cors = require('cors');

const port = process.env.PORT || 5000

///midleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.yaanftr.mongodb.net/?retryWrites=true&w=majority`;



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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const coffeeCollection = client.db("coffeeDB").collection("coffee")

        //post data to mongodb

        app.post("/coffee", async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await coffeeCollection.insertOne(newUser)
            res.send(result)
        })

        // read data from mongodb 

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const readData = await cursor.toArray()
            res.send(readData)

        })

        // delete data from mongo db 
        app.delete("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query)
            res.send(result)
            console.log(result);
        })

        //find a specefic data in mongodb 

        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        //Update data into mongodb

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upserted: true }
            const incommingCoffee = req.body;
            const updatedCoffee = {
                $set: {
                    name: incommingCoffee.name,
                    quantity: incommingCoffee.quantity,
                    supply: incommingCoffee.supply,
                    taste: incommingCoffee.taste,
                    catagory: incommingCoffee.catagory,
                    details: incommingCoffee.details,
                    photo: incommingCoffee.photo,
                }
            }

            const result = await coffeeCollection.updateOne(filter, updatedCoffee, option)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("coffee making server is on")
})

app.listen(port, () => {
    console.log(`Coffee server is running at port: ${port}`);
})