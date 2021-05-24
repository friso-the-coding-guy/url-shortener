const express = require('express');
const app = express();
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoUri = 'mongodb://localhost:27017';
const urlCollection = 'url-shortener';

const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})

app.use(express.json());

app.post('/', async (request, response) => {
    const body = request.body;
    console.log(body);

    try {
        //connect to db
        await client.connect();
        const db = client.db();
        const urls = db.collection(urlCollection);
    
        // put in the data
        const result = await urls.insertOne(body)
        console.log(result);

        // return the saved object
        response.send({
            id: result.ops
        });
    } catch (error) {
        console.error(error);
        response.status(400).send(error);
    } finally {
        client.close();
    }
});

app.get('/:id', async (request, response) => {
    const id = request.params.id;

    try{
        //connect to db
        await client.connect();
        const db = client.db();
        const urls = db.collection(urlCollection);

        //find saved 
        const result = await urls.findOne({ _id: ObjectId(id)});

        urls.listIndexes();
        console.log(result);

        //return saved
        response.send(result);

    } catch (error) {
        console.error(error);
        response.send(error);
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});