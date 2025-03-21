import express from 'express';
import { json, urlencoded } from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/routes.js';


const app = express();
const PORT = 3000;

// reaching to the directory named 'public'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, 'public')));

// settings for ejs-template

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// additional settings

app.use(json());
app.use(urlencoded( { extended : true }));
app.use(cors());

// using settings from the router 

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
})