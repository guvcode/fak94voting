import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  let doc = await req.db
    .collection("contestants")
    .distinct("position", function (err, result) {
        if (err) return null;
        res.json(result);
    });
 
});

export default handler;
