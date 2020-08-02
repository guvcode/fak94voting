import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let result = { status: false, data: null, error: "Not found (X160)" };
    let members = {};

    members = await req.db
      .collection("members")
      .find(
        {},
        {
          sort: { lastName: 1 },
        }
      )
      .toArray();
    result = { status: true, data: members, error: null };

    res.json(result);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.query.email} \n  ${exception.stack}`,
    });
    res.json({ status: false, data: null, error: "An Error occurred (X300)" });
  }
});

export default handler;
