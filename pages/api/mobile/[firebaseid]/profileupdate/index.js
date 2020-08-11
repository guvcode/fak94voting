import nextConnect from "next-connect";
import middleware from "../../../../../middleware/database";
import slack from "../../../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);
handler.post(async (req, res) => {
  //debugger;
  let result = {};
  console.log(req.body);
  try {
    await req.db.collection("members").updateOne(
      { firebaseId: req.query.firebaseid },
      {
        $set: {
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          otherNames: req.body.otherNames,
          birthMonth: req.body.birthMonth,
          birthDay: req.body.birthDay,
          website: req.body.website,
          facebook: req.body.facebook,
          twitter: req.body.twitter,
          instagram: req.body.instagram,
          linkedIn: req.body.linkedIn,
        },
      }
    );

    result = {
      data: true,
      error: null,
    };

    res.json(result);
  } catch (exception) {
    //debugger;
    const result = {
      data: false,
      error: "An error occured on the server, please contact the admin!",
    };
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.body.firebaseId} \n  ${exception.stack}`,
    });
    res.json(result);
  }
});

export default handler;
