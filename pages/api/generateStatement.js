import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  const { authCode, period } = req.body;
  const authOptions = {
    method: "POST",
    url: "https://api.withmono.com/account/auth",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "mono-sec-key": process.env.MONO_SECRET_KEY,
    },
    data: { code: authCode },
  };

  const statementOpts = (userId) => ({
    method: "GET",
    url: `https://api.withmono.com/accounts/${userId}/statement?period=${period}&output=json`,
    headers: {
      Accept: "application/json",
      "mono-sec-key": process.env.MONO_SECRET_KEY,
    },
  });

  try {
    const response = await axios.request(authOptions);
    const statementResp = await axios.request(statementOpts(response.data.id));
    console.log(statementResp, "--- success response ---");
    res.status(200).json({ statement: statementResp.data.data });
  } catch (err) {
    console.error(err.response.data.message, "--- error response ---");
    res.status(400).send("Unsuccessful");
  }
}
