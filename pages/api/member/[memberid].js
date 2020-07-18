import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  // console.log(req.query.memberid);
  try {
    let doc = await req.db
      .collection("members")
      .findOne({ _id: ObjectId(req.query.memberid) });

    const result = { data: doc, error: null };
    res.json(result);
  } catch (exception) {
    //debugger;
    res.json({ data: {}, error: exception });
  }
});

export default handler;
