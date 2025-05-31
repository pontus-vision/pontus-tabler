import express from 'express';
import cors from 'cors';
import pontus from './index'
import { register } from './generated';
import { runQuery } from '../../src/db-utils';

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

app.post("/PontusTest/1.0.0/test/execute", async (req, res) => {
  console.log('[DEBUG] Incoming body:', req.body);

  if (!req.body.query) {
    console.error('[ERROR] Missing query in request body');
    return res.status(400).json({ error: 'Missing query in request body' });
  }

  try {
    const response = await runQuery(req.body.query);
    console.log({ response, path: req.path, body: req.body });
    return res.send({ results: response });
  } catch (err) {
    console.error('[ERROR] runQuery failed:', err);
    return res.status(500).json({ error: 'Query execution failed' });
  }
});

// register(app, { pontus });