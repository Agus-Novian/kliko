const fs = require("fs");
const path = require("path");

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
function getCurrentDate() {
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Fungsi untuk membuat file logging baru berdasarkan tanggal hari ini
function createLogFile(name) {
  const logDirectory = path.resolve("logs"); // Ganti 'logs' dengan direktori yang diinginkan
  const currentDate = getCurrentDate();
  const logFileName = `${name}-${currentDate}.log`;
  const logFilePath = path.join(logDirectory, logFileName);

  // Buat direktori 'logs' jika belum ada
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  // Buat file logging baru jika belum ada
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
  }

  return logFilePath;
}

module.exports = {
  createLogFile,
  getCurrentDate,
  fs,
};
