import express from 'express';
import cors from 'cors';
import { connectBb } from './config/db';


connectBb();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}

);