import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const client = new MongoClient('mongodb+srv://innoventorshq:y2Hu2U9BVy8fXdL@clusterfak94-abmi2.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(client);
async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db('voting');
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
