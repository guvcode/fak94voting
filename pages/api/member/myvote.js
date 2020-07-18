import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  // console.log(req.query.memberid);
 // debugger;
  let doc = await req.db
    .collection("votes")
    .findOne({ userId: req.headers.cookie });

    const result = { data: doc, error: null };
    res.json(result);
});

export default handler;