import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";

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
 // debugger;
  const { userId, selection, votedWhen, electionYear } = req.body;
  //console.log(selection);

 // debugger;

  if (!userId) throw "Unable to vote due to missing data!";
  let count = await req.db
    .collection("votes")
    .countDocuments({ userId: userId });

  if (count > 0) {
    let myVotes = await req.db
      .collection("votes")
      .findOne({ userId: userId, electionYear: electionYear });
    // res.status(403).send("You have already cast your votes.");
    res
      .status(403)
      .json({ error: true, message: "You have voted already", votes: myVotes });
    return;
  } else {
    const votes = await req.db.collection("votes").insertOne({
      userId: userId,
      selection: selection,
      voteCastAt: votedWhen,
      electionYear: electionYear
    });

    res.json(votes);
  }
});

export default handler;
