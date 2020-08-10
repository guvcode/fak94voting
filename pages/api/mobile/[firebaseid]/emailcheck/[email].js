import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../../../middleware/database";
import slack from "../../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = { status: false, data: null, error: "Not found (X060)" };
    let doc = await req.db
      .collection("members")
      .findOne({ email: req.query.email });

    console.log(doc);
    if (doc && !doc.firebaseId) {
      await req.db.collection("members").updateOne(
        { email: req.query.email },
        {
          $set: {
            firebaseId: req.query.firebaseid,
          },
        }
      );
      result = { status: true, data: doc, error: null };
    }

    if (doc && doc.firebaseId && req.query.firebaseid != doc.firebaseId) {
      console.log(req.query.firebaseid);
      console.log(doc.firebaseId);
      result = {
        status: false,
        data: null,
        error: "Data mismatch getting user data (X070)",
      };
    } else {
      result = { status: true, data: doc, error: null };
    }

    if (!doc) {
       result = { status: false, data: null, error: "Not found (X060)" };
    }
    
    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.query.email} \n firebaseid : ${req.query.firebaseid} \n  ${exception.stack}`,
    });
    res.json({ status: false, data: null, error: "An Error occurred (X200)" });
  }
});

export default handler;
