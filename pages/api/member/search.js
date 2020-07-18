import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
  //debugger;
  let result = {};
  try {
    let doc = await req.db
      .collection("members")
      .find({
        $or: [
          {
            email: { $regex: req.body.search, $options: "i" },
          },
          {
            firstName: { $regex: req.body.search, $options: "i" },
          },
          {
            lastName: { $regex: req.body.search, $options: "i" },
          },
        ],
      })
      .toArray();

   // debugger;
    if (doc) {
      result = {
        data: { doc },
        error: null,
      };
    } else {
      result = {
        data: {},
        error: null,
      };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    const result = {
      data: {},
      error: "An error occured on the server, please contact the admin!",
    };
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.body.search} \n  ${exception.stack}`,
    });
    res.json(result);
  }
});

export default handler;
