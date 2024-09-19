import express from 'express';
import 'dotenv/config';
import routers from './routes/router';
import cors from 'cors';
import { connect } from './model/database';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/api', routers);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

connect();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

