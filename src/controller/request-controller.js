const { tokenFetch } = require("../application/axios-auth");
const { axiosInstance } = require("../application/axios-instance");
const { createLogFile, fs } = require("../application/logging");

const balance = async (req, res, next) => {
  const payload = "";

  //Encrypting and Hashing
  const hashPayload = hashedPayload(payload);

  try {
    const accessTokenKliko = await tokenFetch();
    //Serealizing
    const s2s_sig = string2SgnSig(
      "GET",
      "/v1/open-api/balance",
      accessTokenKliko,
      hashPayload,
      currentDate()
    );

    const digitalSignature = SHA512toBase64(
      s2s_sig,
      process.env.CLIENT_KLIKO_SECRET_PROD
    );

    const response = await axiosInstance.get(`/v1/open-api/balance`, {
      headers: {
        "Open-Api-Timestamp": `${currentDate()}`,
        "Open-Api-Signature": `${digitalSignature}`,
        Authorization: `Bearer ${accessTokenKliko}`,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    const logErrorFilePath = createLogFile("error");
    fs.appendFileSync(logErrorFilePath, JSON.stringify(error) + "\n", "utf8");

    console.error(JSON.stringify(error.response.data));
    res.status(error.response.status).json(error.response.data);
  }
};

const products = async (req, res, next) => {
  const payload = {
    limit: parseInt(req.query.limit),
    page: parseInt(req.query.page),
    search: [
      {
        field: "keyword",
        value: req.query.keyword || ``,
      },
      {
        field: "enable",
        value: "true",
      },
    ],
    sort: {
      field: "agent_price",
      value: "desc",
    },
  };

  //Encrypting and Hashing
  const minifiedPayload = JSON.stringify(payload);
  const hashPayload = hashedPayload(minifiedPayload);

  try {
    const accessTokenKliko = await tokenFetch();
    //Serealizing
    const s2s_sig = string2SgnSig(
      "POST",
      "/v1/open-api/products",
      accessTokenKliko,
      hashPayload,
      currentDate()
    );
    const digitalSignature = SHA512toBase64(
      s2s_sig,
      process.env.CLIENT_KLIKO_SECRET_PROD
    );

    const response = await axiosInstance.post(
      `/v1/open-api/products`,
      minifiedPayload,
      {
        headers: {
          "Open-Api-Timestamp": `${currentDate()}`,
          "Open-Api-Signature": digitalSignature,
          Authorization: `Bearer ${accessTokenKliko}`,
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    const logErrorFilePath = createLogFile("error");
    fs.appendFileSync(logErrorFilePath, JSON.stringify(error) + "\n", "utf8");

    console.error(JSON.stringify(error.response.data));
    res.status(error.response.status).json(error.response.data);
  }
};

module.exports = { balance, products };
