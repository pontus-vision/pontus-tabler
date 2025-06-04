import express from 'express';
import cors from 'cors';
import pontus from './index'
import { register } from './generated';

export const app = express();

const port = 3001;

app.use(cors());

app.use(express.json());


app.listen(port, () => {

   console.log(
     'Your server is listening on port %d (http://localhost:%d)',
     port,
     port,
   );
})
register(app, { pontus });