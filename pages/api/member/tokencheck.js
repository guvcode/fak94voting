import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  debugger;
  let result = {};
  try {
    let doc = await req.db
      .collection("members")
      .findOne({ email: req.body.emailAddress, accessCode: req.body.token });

    if (!doc) {
      result = {
        data: { tokenValid: false, userFound: true },
        error: "Token not valid for this user, please check your whatsapp for the latest token",
      };
      return res.json(result);
    }

    const dbDateTime = doc.accessCodeExpiry;
    const nowDateTime = Date.now();

    if (nowDateTime > dbDateTime) {
      result = {
        data: { tokenValid: false, userFound: true},
        error: "Provided token has expired",
      };
      return res.json(result);
    }

    result = {
      data: { tokenValid: true, userFound: true , userId: doc._id.toString()},
      error: null,
    };

    return res.json(result);
  } catch (exception) {
    //debugger;
    const result = {
      data: {},
      error: "An error occurred on the server, please contact the admin!",
    };
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.body.emailAddress} \n  ${exception.stack}`,
    });
    return res.json(result);
  }
});

export default handler;
