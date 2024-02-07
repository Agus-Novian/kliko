const { default: axios } = require("axios");

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = { axiosInstance };
