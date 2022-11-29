import express from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

dotenv.config();
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT ?? 8080;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const app = express();

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 5, // Limit each IP to 1 requests per `window` (here, per 10 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.static('pages', { root: '.' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile('index.html');
});

app.post("/", limiter, async (req, res) => {
    const email = req.body.email;

    try {
        console.log(email);
        const database = client.db('main').collection('emails');

        const log = await database.insertOne({ email });
        console.log(log);

        res.redirect('/');
    } catch {
        res.redirect('404.html');
    }
});

app.listen(PORT);
