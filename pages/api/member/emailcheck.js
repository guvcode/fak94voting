import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import slack from "../../../middleware/logger";
var request = require('request-promise');

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
 // debugger;
  let result = {};
  try {
    let doc = await req.db
      .collection("members")
      .findOne({ email: req.body.emailAddress });

    if (doc) {
      const newToken = generateOTP();
      console.log(newToken);
      const msg = `Hello ${doc.firstName}, please use ${newToken} as your Voters access code, please keep this safe and do not share with anyone `;
      var date = new Date();
      var newDate =  date.setHours(date.getHours() + 1)
     // console.log(newDate);
     //await sendWhatsAppMessage(doc.phoneNumber, msg);

      await req.db.collection("members").updateOne(
        { email: req.body.emailAddress },
        {
          $set: {
            accessCode: newToken,
            accessCodeExpiry: newDate,
          },
        }
      );

      result = {
        data: { tokenSent: true, userFound: true },
        error: null,
      };
    } else {
      result = {
        data: { tokenSent: false, userFound: false },
        error: null,
      };
    }

    res.json(result);
  } catch (exception) {
    //debugger;
    const result = { data: {}, error: "An error occured on the server, please contact the admin!" };
    slack.send({
      channel: '#fak94Errors',     
      text: `email : ${req.body.emailAddress} \n  ${exception.stack}`,     
    });
    res.json(result);
  }
});

export default handler;

function generateOTP() {
  // Declare a string variable
  // which stores all string
  var string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let OTP = "";

  // Find the length of string
  var len = string.length;
  for (let i = 0; i < 6; i++) {
    OTP += string[Math.floor(Math.random() * len)];
  }
  return OTP;
}

async function sendWhatsAppMessage(phoneNo, msg) {
  var options = {
    method: "POST",
     uri: "https://api.wassenger.com/v1/messages",
    headers: {
      "content-type": "application/json",
      token:
        "ecd3a64dbf5b90cf999ebda707deebd017ad73703144637905da06991a7c0994d2d88e6ffd7581b5",
    },
    body: { phone: phoneNo, message: msg , priority: "normal",},
    json: true,
  };


  const result = await request (options);
  //debugger;
  //console.log(result);
  /* await request(options, function (error, response, body) {
    debugger;
    if (error) throw new Error(error);

    console.log(body);
  }); */
 
}
