/*================ imports ============== */
const express = require("express");
const app = express();
const cors = require("cors");
const initTreatmentsCrud = require("./treatmentsCrud");
const initUsersCrud = require("./usersCrud");
const client = require("./db");
client.connect();
require("dotenv").config();

/*=============== middlewares ===========*/
app.use(cors());
app.use(express.json());


/*=============== crud =============*/
initTreatmentsCrud(app);
initUsersCrud(app);

/*=============== server =============*/
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is on port: ${port}`);
});
