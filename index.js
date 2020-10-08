const express = require('express')
const Mongo = require('mongodb')

const app = express()
const PORT = 2003
const uri = "mongodb+srv://fikri:123123123@sporteens1.c0rt6.gcp.mongodb.net/toko_baju?retryWrites=true&w=majority";
const client = new Mongo.MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true});


app.use(express.json())


let db;

client.connect(err => {
    if(err) throw err;
    db = client.db("toko_baju");

});

function sendError (res,message) {
    res.send({
        error : true,
        message
    })
}



app.get('/' , (req,res) => {
    res.send('Welcome to mongo db api')
})

app.get('/users' , (req,res) => {
    db.collection('users').find().toArray((err,data) => {
        try {
            if(err) throw err
            res.send(data)
        } catch (error) {
            sendError(res,error.message)
        }
    })
})


app.get('/user/:id' , (req,res) => {
    let id = req.params.id
    id = Mongo.ObjectID(id)

    db.collection('users').find({_id : id}).toArray((err,result) =>{ 
        try {
            if(err) throw err
            res.send(result[0])
        } catch (error) {
            sendError(res,error.message)
        }
    })    
})

app.get('/user', (req,res) => {
    let name = req.query.name
    let address = req.query.address

    let filter = {}

    if(name) filter.name = name.toLowerCase()
    if(address) filter.address = address.toLowerCase()
    db.collection('users').find(filter).toArray((err,result) => {
        try {
            if(err) throw err
            res.send(result)
        } catch (error) {
            sendError(res,error.message)
        }
        
    })
    
})

app.post('/user',(req,res) => {
    const data = req.body // {usernmae , password, address}

    try {
        if(!data.username) throw {message :'username cannot null'}
        if(!data.password) throw {message :'password cannot null'}
        if(!data.address) throw {message :'address cannot null'}
        db.collection('users').insertOne(data , (err,result) => {
            try {
                if(err) throw err
                res.send({
                    error : false,
                    message : "insert success with id " + result.insertedId
                })
            } catch (error) {
                sendError(res,error.message)
            }
        })

    } catch (error) {
        sendError(res,error.message)
    }
})

app.patch('/user/:id' , (req,res) => {
    const id = req.params.id
    const data = req.body

    // update user set username = 'seto' and address = 'semarang' where id = 1
    // db.coll('name').updateOne({_id : 1} , { $set : {username : "seto" , address : "Semarang"}})

    try {
        if(!id) throw {message : "id cannot null"}
        let query = {_id : Mongo.ObjectID(id)}

        let newValues = {}
        if(data.username)  newValues.username = data.username
        if(data.password)  newValues.password = data.password
        if(data.address)  newValues.address = data.address

        db.collection('users').updateOne(query,{$set : newValues},(err,result) => {
            try {
                if(err) throw err
                if(result.matchedCount === 0) throw {message : "id not found"}

                res.send({
                    error : false,
                    message : "Update data success"
                })
            } catch (error) {
                sendError(res,error.message)
            }
        })


    } catch (error) {
        sendError(res,error.message)
    }

   
})


app.delete('/user/:id' , (req,res) => {
    const id = req.params.id
    try {
        if(!id) throw {message : "id cannot null"}
        let query = {_id : Mongo.ObjectID(id)}

        db.collection('users').deleteOne(query,(err,result) => {
            try {
                if(err) throw err
                if(result.deletedCount === 0) throw {message : "id not found"}
                res.send({
                    error : false,
                    message : "delete data success"
                })
            } catch (error) {
                sendError(res,error.message)
            }
        })

    } catch (error) {
        sendError(res,error.message)
    }
})



app.listen(PORT , () => console.log('Server Running on port ' + PORT))



// register account di mongo db
// create free cluster at mongodb atlas
// database access (create user in database)
// network access (whitelist ip address) biar bisa connect
// create collection
// cluster -> database -> collections (table) -> data (object)(key value pair)
// connect with express node js (express mongodb)
