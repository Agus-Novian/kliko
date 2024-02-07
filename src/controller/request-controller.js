const { axiosInstance } = require("../application/axios-instance");
const { hashingMD5 } = require("../application/helper");
const axios = require("axios").default;
const { createLogFile, fs } = require("../application/logging");

const balance = async (req, res, next) => {
  const username = process.env.USERNAME;
  const data = {
    cmd: "deposit",
    username: username,
    sign: hashingMD5(username, "depo"),
  };

  try {
    const response = await axiosInstance.post(
      `${process.env.BASE_URL}/v1/cek-saldo`,
      data
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    const logErrorFilePath = createLogFile("error");
    fs.appendFileSync(logErrorFilePath, JSON.stringify(error) + "\n", "utf8");

    console.error(JSON.stringify(error.response.data));
    res.status(error.response.status).json(error.response.data);
  }
};

module.exports = { balance };
