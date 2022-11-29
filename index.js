import express from "express"
import { MongoClient, ServerApiVersion } from "mongodb"
import dotenv from "dotenv"

dotenv.config();
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT ?? 8080;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();

app.use(express.static('pages', { root: '.' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

app.post("/", async (req, res) => {
    const email = req.body.email;

    try {
        console.log(email);
        const database = client.db('main').collection('emails');

        const log = await database.insertOne({ email });
        console.log(log);

        res.redirect('/');
    } catch {
        res.redirect('404.html');
    } finally {
        
    }
})

app.listen(PORT);


// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });