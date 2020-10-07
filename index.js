const express = require('express')
const Mongo = require('mongodb')

const app = express()
const PORT = 2003
const uri = "mongodb+srv://fikri:123123123@sporteens1.c0rt6.gcp.mongodb.net/toko_baju?retryWrites=true&w=majority";
const client = new Mongo.MongoClient(uri, { useNewUrlParser: true });


app.get('/' , (req,res) => {
    res.send('Welcome to mongo db api')
})

app.get('/users' , (req,res) => {

    client.connect(err => {
        const collection = client.db("toko_baju").collection("users");
        collection.find({}).toArray((err,docs) => {
            if(err) throw err
            res.send(docs)
        })
        // perform actions on the collection object
        client.close();
    });
})

app.listen(PORT , () => console.log('Server Running on port ' + PORT))



// register account di mongo db
// create free cluster at mongodb atlas
// database access (create user in database)
// network access (whitelist ip address) biar bisa connect
// create collection
// cluster -> database -> collections (table) -> data (object)(key value pair)
// connect with express node js
