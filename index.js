/*================ imports ============== */
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initTreatmentsCrud = require("./treatmentsCrud");
const initUsersCrud = require("./usersCrud");
const client = require("./db");
const app = express();
app.use(cookieParser());
client.connect();
require("dotenv").config();

const allowedOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      var msg =
        "The CORS policy for this site does not " +
        "allow access from the specified Origin.";
      callback(new Error(msg), false);
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

/*=============== middlewares ===========*/
app.use(cors(corsOptions));
app.use(express.json());


/*=============== crud =============*/
initTreatmentsCrud(app);
initUsersCrud(app);

/*=============== server =============*/
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`app is on port: ${port}`);
});
