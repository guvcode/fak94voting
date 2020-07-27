import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../../middleware/database";
import slack from "../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = { status: false, data: null, error: "Not found (X160)" };
    let members = {};
    let doc = await req.db
      .collection("members")
      .findOne({ firebaseId: req.query.firebaseid });

    if (doc) {
      members = await req.db.collection("members").find({}).toArray();
      result = { status: true, data: members, error: null };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.query.email} \n firebaseid : ${req.query.firebaseid} \n  ${exception.stack}`,
    });
    res.json({ status: false, data: null, error: "An Error occurred (X300)" });
  }
});

export default handler;
