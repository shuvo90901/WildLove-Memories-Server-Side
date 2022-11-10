const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r1zym1k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollection = client.db('photography').collection('services');
        const reviewCollection = client.db('photography').collection('reviews');


        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/serviceslimit', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const count = await servicesCollection.estimatedDocumentCount();
            const services = await cursor.skip(count - 3).toArray();
            res.send(services)
        });

        // app.get('/serviceslimit',async(req,res)=>{
        //     const query={}
        // })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log(service)
            res.send(service)
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
    }
    finally {

    }
}

run().catch(er => console.error(er))


app.get('/', (req, res) => {
    res.send('wonderful travel server is running')
})



app.listen(port, () => {
    console.log(`wonderful travel server running on : ${port}`)
})