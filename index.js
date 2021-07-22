const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iprmr.mongodb.net/emaJhonStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");

  app.post('/addProducts',(req,res) =>{
     const product = req.body
     productsCollection.insertOne(product)
     .then(result =>{
         console.log(result.insertedCount)
         res.send(result.insertedCount)
     })
  })

  app.get('/products',(req,res) =>{
      productsCollection.find({})
      .toArray( (err,documents) =>{
          res.send(documents)
      })
  })

  app.get('/product/:key',(req,res) =>{
    productsCollection.find({key: req.params.key})
    .toArray( (err,documents) =>{
        res.send(documents[0])
    })
})

app.post('/prouctsByKeys',(req,res) =>{
    const productKeys = req.body;
    productsCollection.find({key : {$in:productKeys}})
    .toArray((err,documents) =>{
        res.send(documents);
    })
})

app.post('/addOrder',(req,res) =>{
    const order = req.body
    ordersCollection.insertOne(order)
    .then(result =>{
        
        res.send(result.insertedCount > 0)
    })
 })


});


app.listen(port)