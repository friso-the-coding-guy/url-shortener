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

app.post('/api/url', (request, response) => {
    const body = request.body;

    mongoClient.connect(async (error, client) => {
        if (error) {
            console.error(error);
            response.status(400).send(error);
            return;
        }

        const db = client.db(URLDATABASE);
        const urls = db.collection(URLCOLLECTION);

        // put in the data
        urls.insertOne(body, (error, result) => {
            if (error) {
                console.error(error);
                response.status(400).send(error);
                return;
            }

            response.send({
                id: result.ops
            });
        });
    });
});

app.get('/api/url/:uri', (request, response) => {
    const uri = request.params.uri;

    mongoClient.connect((error, client) => {
        if (error) {
            console.error(error);
            response.status(400).send(error);
            return;
        }

        const db = client.db(URLDATABASE);
        const urls = db.collection(URLCOLLECTION);

        //find saved 
        urls.findOne({'$or' : [{'_id': OBJECTID.isValid(uri) ? OBJECTID(uri) : undefined}, {'shortUri': uri}]}, (error, result) => {
            if (error) {
                console.error(error);
                response.status(400).send(error);
                return;
            }

            response.send(result);
        });
    });
});

app.get('/:uri', (request, response) => {
    const uri = request.params.uri;

    mongoClient.connect((error, client) => {
        if (error) {
            console.error(error);
            response.status(400).send(error);
            return;
        }

        const db = client.db(URLDATABASE);
        const urls = db.collection(URLCOLLECTION);

        urls.findOne({'$or' : [{'_id': OBJECTID.isValid(uri) ? OBJECTID(uri) : undefined}, {'shortUri': uri}]}, (error, result) => {
            if (error) {
                console.error(error);
                response.status(400).send(error);
                return;
            }

            response.redirect(result.url);
        });
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});