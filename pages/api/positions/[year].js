import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
 // debugger;
  let doc = await req.db
    .collection("contestants")
    .distinct("position", { electionYear: req.query.year }, function (
      err,
      result
    ) {
      if (err) {
        res.json({ data: {}, error: err });
      } else {       
        res.json( { data: result, error: null });
      }
    });
});

export default handler;
