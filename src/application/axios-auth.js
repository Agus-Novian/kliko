const { axiosInstance } = require("../application/axios-auth");
const { currentDate, stringToSign, hashing256withRSA } = require("./helper");
const { fs } = require("./logger");

let accessToken = null;
let tokenExpirationTime = 0;

async function tokenFetch() {
  const s2s = stringToSign(process.env.CLIENT_KLIKO_ID_PROD, currentDate());
  const hashed = hashing256withRSA(
    s2s,
    fs.readFileSync("other/private.pem", "utf8")
  );

  if (!accessToken || Date.now() >= tokenExpirationTime) {
    try {
      const response = await axiosInstance.post(
        `${process.env.BASE_URL_KLIKO_PROD}/v1/open-api/access-token`,
        {
          grant_type: "client_credentials",
          additional_info: {
            client_id: `${process.env.CLIENT_KLIKO_ID_PROD}`,
            client_secret: `${process.env.CLIENT_KLIKO_SECRET_PROD}`,
          },
        },
        {
          headers: {
            "Open-Api-Timestamp": `${currentDate()}`,
            "Open-Api-Signature": `${hashed}`,
          },
        }
      );

      // Simpan token dan waktu kadaluwarsa

      accessToken = response.data.data.access_token;
      tokenExpirationTime = Date.now() + response.data.data.expires_in * 1000;
      console.log(`REQUEST TOKEN ${accessToken}`);
    } catch (error) {
      console.error(
        "Error getting token:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
  return accessToken;
}

module.exports = { tokenFetch };
