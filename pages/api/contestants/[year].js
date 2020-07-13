import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  let doc =await req.db
  .collection("contestants")
  .find({electionYear: req.query.year},{ sort: { positionIndex: -1 } })
  .toArray();

  
  const result = { data: doc, error: null };
  res.json(result);
});

export default handler;

