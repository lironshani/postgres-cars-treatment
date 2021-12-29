/*================ imports ============== */
const express = require("express");
const app = express();
const cors = require("cors");
const initcrud = require("./crud");
require("dotenv").config();

/*=============== middlewares ===========*/
app.use(cors());
app.use(express.json());

/*=============== crud =============*/
initcrud(app);

/*=============== server =============*/
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is on port: ${port}`);
});
