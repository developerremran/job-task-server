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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const TeamUsersData = client.db('TeamUsersDatauserData').collection('TeamUsersDataCollection')


    app.get('/users', async (req, res) => {
      const { domain, gender, availability, search } = req.query;
      const query = {};

      if (search) {
        query.first_name = { $regex: new RegExp(search, 'i') };
      }

      if (domain) {
        query.domain = { $in: domain.split(',') };
      }

      if (gender) {
        query.gender = { $in: gender.split(',') };
      }

      if (availability) {
        query.availability = { $in: availability.split(',') };
      }

      try {
        const result = await usersData.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching users.');
      }
    });

  app.post('/teamMember', async (req, res) => {
    const user = req.body;
    const email = req.query.email;
    const query = { email: email };
    const exit = await TeamUsersData.findOne(query)
    if(exit){
     return res.send('user already selected')
    }
    const result = await TeamUsersData.insertOne(user);
    res.send(result);
  });


    app.get('/teamMember', async (req, res) => {
      const body = req.body
      const result = await TeamUsersData.find(body).toArray()
      res.send(result)
    })

    // app.delete('/teamMember/:email', async(req, res)=>{
    //   const email = req.query.email;
    //   console.log(email);
    //   const query = {email : email};
    //   const result = await TeamUsersData.deleteOne(query)
    //   res.send(result)
    // })
    app.delete('/teamMember/:email', async (req, res) => {
      const email = req.params.email; // Use req.params instead of req.query
      // console.log(email);
      const query = { email: email };
      const result = await TeamUsersData.deleteOne(query);
      res.send(result);
    });





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