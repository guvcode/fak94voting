import nextConnect from "next-connect";
import { ObjectId } from "mongodb";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";
import Airtable from "airtable";

var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appSg0uYgawcwAQ56"
);

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {
  try {
    let members = {};

    const currentMonth = Date.getMonth();
    const currentDay = Date.getDate();

    trashExistingBirthdays();

    members = await req.db
      .collection("members")
      .find({ birthMonth: currentMonth, birthDay: { $gte: currentDay } })
      .project({
        firstName: 1,
        lastName: 1,
        otherNames: 1,
        birthDay: 1,
        birthMonth: 1,
        photoURL: 1,
      })
      .sort({ birthDay: -1 })
      .toArray();

    res.json(true);
  } catch (exception) {
    //debugger;
    slack.send({
      channel: "#fak94Errors",
      text: `email : ${req.query.email} \n  ${exception.stack}`,
    });
    res.json(false);
  }
});

export default handler;

function trashExistingBirthdays() {
  base("birthdays").destroy(["recJyjqHsYbeIurZX"], function (
    err,
    deletedRecords
  ) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Deleted", deletedRecords.length, "records");
  });
}

function addNewBirthday(member) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var monthName = months[member.birthMonth];
  const fullName = member.lastName.concat(
    " ",
    member.firstName,
    " ",
    member.otherNames
  );
  base("birthdays").create(
    {
      fullName: fullName,
      month: monthName,
      day: member.birthDay,
      photo: member.photoURL,
    },
    function (err, record) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(record.getId());
    }
  );
}
