const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleWare 
app.use(cors())
app.use(express.json())

// console.log(process.env.USER_N)

// mongodb...

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_N}:${process.env.SECRET_KEY}@cluster0.f4adszp.mongodb.net/?retryWrites=true&w=majority`;


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

    const usersData = client.db('userData').collection('userCollection')

    app.get('/users', async (req, res) => {
      const body = req.body;
      const search = req.query.search;
      const query = { first_name: { $regex: new RegExp(search, 'i') } };
      // console.log(search);
      const result = await usersData.find(query, body).toArray()
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



// mongodb...



app.get('/', (req, res) => {
  res.send('Server live 🥰!')
})

app.listen(port, () => {
  console.log(`Server running now🥰 ${port}`)
})