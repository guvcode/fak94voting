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
});
*/
// POST /api/vote
handler.post(async (req, res) => {
  //console.log(req.body);
  const { userId, selection, votedWhen } = req.body;
  //console.log(selection);

  debugger;

  let count = await req.db
    .collection("votes")
    .countDocuments({ userId: userId.userid });

  if (count > 0) {
    let myVotes = await req.db
      .collection("votes")
      .findOne({ userId: userId.userid });
    // res.status(403).send("You have already cast your votes.");
    res
      .status(403)
      .json({ error: true, message: "Vote already cast", votes: myVotes });
    return;
  } else {
    const votes = await req.db
      .collection("votes")
      .insertOne({
        userId: userId.userid,
        selection: selection,
        voteCastAt: votedWhen,
      });

    res.json(votes);
  }
});

export default handler;
