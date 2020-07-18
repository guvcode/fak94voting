import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";
import { ObjectId } from "mongodb";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  debugger;
  let result = {};
  try {
    let doc = await req.db
      .collection("members")
      .findOne({ _id: ObjectId(req.body.id) });

    if (doc) {
      await req.db.collection("members").updateOne(
        { _id: ObjectId(req.body.id) },
        {
          $set: {
            role: req.body.role,
          },
        }
      );

      await req.db.collection("auditlog").insertOne({
        actionBy: req.body.changedBy,
        action: "change role",
        newValues: req.body.role,
        accountUpdated:  doc.firstName + " " + doc.lastName,
        actionTime: new Date(),
      });

      result = {
        data: true,
        error: null,
      };
    } else {
      result = {
        data: false,
        error: null,
      };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    const result = {
      data: false,
      error: "An error occured on the server, please contact the admin!",
    };
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.body.emailAddress} \n  ${exception.stack}`,
    });
    res.json(result);
  }
});

export default handler;
