import express from 'express';
import playerRoutes from './players/routes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());
app.use(cors()); 

app.use('/player', playerRoutes);


app.use((err: any, req: express.Request, res: express.Response) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
