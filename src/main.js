const web = require("./application/web");

const port = process.env.PORT || 3000;
web.listen(port, () => {
  console.log(`Klikoo listening on port ${port}`);
});
