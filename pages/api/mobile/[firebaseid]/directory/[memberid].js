import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../../../middleware/database";
import slack from "../../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = { status: false, data: null, error: "Not found (X360)" };
    let member = {};
    let doc = await req.db
      .collection("members")
      .findOne({ firebaseId: req.query.firebaseid });

    if (doc) {
      member = await req.db
        .collection("members")
        .findOne({_id: ObjectId(req.query.memberid)},);
      result = { status: true, data: member, error: null };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `memberid : ${req.query.memberid} \n firebaseid : ${req.query.firebaseid} \n  ${exception.stack}`,
    });
    res.json({ status: false, data: null, error: "An Error occurred (X381)" });
  }
});

export default handler;
