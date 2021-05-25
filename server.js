const express = require('express');
const app = express();
const port = 3000;

const MONGOCLIENT = require('mongodb').MongoClient;
const OBJECTID = require('mongodb').ObjectId;
const MONGOURI = 'mongodb://localhost:27017';
const URLDATABASE = 'url-shortener';
const URLCOLLECTION = 'urls';

const mongoClient = new MONGOCLIENT(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})

app.use(express.json());

app.post('/', (request, response) => {
    const body = request.body;
    console.log(body);

    mongoClient.connect(async (error, client) => {
        if (error) {
            console.error(error);
            response.status(400).send(error);
        }

        const db = client.db(URLDATABASE);
        const urls = db.collection(URLCOLLECTION);

        // put in the data
        urls.insertOne(body, (error, result) => {
            if (error) {
                console.error(error);
                response.status(400).send(error);
            }

            response.send({
                id: result.ops
            });
        });
    });
});

app.get('/:id', (request, response) => {
    const id = request.params.id;

    mongoClient.connect((error, client) => {
        if (error) {
            console.error(error);
            response.status(400).send(error);
        }

        const db = client.db(URLDATABASE);
        const urls = db.collection(URLCOLLECTION);

        //find saved 
        urls.findOne({ _id: OBJECTID(id)}, (error, result) => {
            if (error) {
                console.error(error);
                response.status(400).send(error);
            }

            response.send(result);
        });
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});