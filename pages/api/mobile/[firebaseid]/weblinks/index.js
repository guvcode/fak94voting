import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../../../middleware/database";
import slack from "../../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = { status: false, data: null, error: "Not found (X560)" };
    let weblinks = {};
    let doc = await req.db
      .collection("members")
      .findOne({ firebaseId: req.query.firebaseid });

    if (doc) {
        weblinks = await req.db
        .collection("weblinks")
        .find();
      result = { status: true, data: weblinks, error: null };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `firebaseid : ${req.query.firebaseid} \n  ${exception.stack}`,
    });
    res.json({ status: false, data: null, error: "An Error occurred (X581)" });
  }
});

export default handler;
