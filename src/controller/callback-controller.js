const { hashingHmacSHA1, currentDate } = require("../application/helper");
const axios = require("axios").default;
const { createLogFile, fs } = require("../application/logging");

const callback = async (req, res, next) => {
  const xDigiflazzDelivery = req.header("X-Digiflazz-Delivery");
  const xHubSignature = req.header("X-Hub-Signature");
  const body = req.body;
  const data = JSON.stringify(body);
  const validSignature = `sha1=${hashingHmacSHA1(data, process.env.SECRET)}`;

  const logErrorFilePath = createLogFile("callback");
  fs.appendFileSync(
    logErrorFilePath,
    `[${currentDate()}] xDigiflazzDelivery: ${xDigiflazzDelivery} xHubSignature: ${xHubSignature} validSignature: ${validSignature} IP: ${
      req.ip
    } ${data} \n`,
    "utf8"
  );

  if (xHubSignature === validSignature) {
    try {
      if (/^rc-xl.*$/.test(body.data.ref_id)) {
        axios.get(`${process.env.URL_CALLBACK_RC_XL}?message=${data}`);
      } else if (/^rc-isat.*$/.test(body.data.ref_id)) {
        axios.get(`${process.env.URL_CALLBACK_RC_ISAT}?message=${data}`);
      } else {
        axios.get(`${process.env.URL_CALLBACK_RC_MIX}?message=${data}`);
      }

      res.status(200).json({
        message: "OK",
        status: "succeeded",
        meta: {
          http_status: 200,
        },
      });
    } catch (error) {
      const logErrorFilePath = createLogFile("error");
      fs.appendFileSync(logErrorFilePath, JSON.stringify(error) + "\n", "utf8");

      console.error(JSON.stringify(error.response.data));
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.status(401).json({
      message: "Unauthorized",
      response_code: 50401,
      meta: {
        http_status: 401,
      },
    });
  }
};

module.exports = { callback };
