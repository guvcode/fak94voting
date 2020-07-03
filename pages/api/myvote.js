import nextConnect from "next-connect";
import middleware from "../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

/*handler.get(async (req, res) => {
  //res.status(403).send('You have already cast your votes.');
  //debugger;
  let count = await req.db
    .collection("votes")
    .countDocuments({ userId: req.userId });
  if (count < 1) return res.json({});

  let doc = await req.db
    .collection("votes")
    .findOne({ userId: req.userId })
    .toArray();
    debugger;
  res.json(doc);
});*/

// POST /api/vote
handler.post(async (req, res) => {
  //console.log(req.body);
  const { userId } = req.body;

  let myVotes = await req.db
    .collection("votes")
    .findOne({ userId: userId.userid });

  myVotes ? res.json(myVotes) : res.json({});
});

export default handler;
