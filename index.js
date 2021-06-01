const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();
const port = 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkkoe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const productsColloection = client.db(`${process.env.DB_NAME}`).collection("products");
    const ordersColloection = client.db(`${process.env.DB_NAME}`).collection("order");

    console.log('database conected')
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsColloection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)

            })
    })

    app.get('/products', (req, res) => {
        productsColloection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/products/:key', (req, res) => {
        productsColloection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsBykeys', (req, res) => {
        const productkeys = req.body;
        productsColloection.find({key: {$in: productkeys}})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersColloection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)

            })
    })
});


app.listen(port)
