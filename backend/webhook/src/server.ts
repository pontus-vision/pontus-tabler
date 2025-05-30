import express from 'express';
import cors from 'cors';
import pontus from './index'
import { register } from './generated';

export const app = express();

const port = 8000

app.use(cors());
app.use(express.json());

app.listen(port, ()=>{

console.log('INITIATING WEBHOOK SERVER ON PORT ' + port)
})

register(app, { pontus });