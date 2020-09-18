import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";
import { ObjectId } from "mongodb";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  //debugger;
  let result = {};
  try {
    let doc = await req.db
      .collection("members")
      .findOne({ _id: ObjectId(req.body.id) });

    if (doc) {
      const recordExists =
        doc.votingRights &&
        doc.votingRights.find((x) => x.year == req.body.votingYear);
      if (recordExists) {
        await req.db.collection("members").updateOne(
          {
            _id: ObjectId(req.body.id),
            "votingRights.year": req.body.votingYear,
          },
          {
            $set: {
              "votingRights.$.canVote": req.body.canVote,
            },
          }
        );
      } else {
        await req.db.collection("members").updateOne(
          {
            _id: ObjectId(req.body.id)
          },
          {
            $addToSet: {
              votingRights: {
                year: req.body.votingYear,
                canVote: req.body.canVote,
              },
            },
          }
        );
      }

      await req.db.collection("auditlog").insertOne({
        actionBy: req.body.changedBy,
        action: "voting rights update",
        newValues: req.body.canVote ,
        votingYear: req.body.votingYear,
        accountUpdated: doc.firstName + " " + doc.lastName,
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
      text: `email : ${req.body.id} \n votingyear : ${req.body.votingYear} \n  ${exception.stack}`,
    });
    res.json(result);
  }
});

export default handler;
