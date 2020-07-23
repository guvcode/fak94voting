import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();
//debugger;
handler.use(middleware);

handler.get(async (req, res) => {
  let doc =await req.db
  .collection("pollInfo")
  .findOne({electionYear: req.query.year});

  const result = { data: doc, error: null };
  res.json(result);
});

export default handler;

