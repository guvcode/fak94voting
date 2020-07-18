import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = false;
    let doc = await req.db
      .collection("members")
      .findOne({ email: req.query.email });

    if (doc) {
      await req.db.collection("members").updateOne(
        { email: Objecreq.query.email },
        {
          $set: {
            firebaseId: req.query.firebaseid,
          },
        }
      );
       result = true;
    }    
   
    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
        channel: "#fak94Errors",
        text: `email : ${req.body.email} \n firebaseid : ${req.body.fiebaseid} \n  ${exception.stack}`,
      });
    res.json(false);
  }
});

export default handler;
