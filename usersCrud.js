const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const client = require("./db");
const sendEmail = require("./email");
const { verifyToken } = require("./middlewares");

const saltRounds = 10;
const maxAge = 365 * 24 * 60 * 60;

const createToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, {
    expiresIn: maxAge,
  });

const init = (app) => {
  app.post("/users/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    try {
      // check if user exist
      const existed_user = await client.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      if (existed_user && existed_user.rows && existed_user.rows[0]) {
        res
          .status(400)
          .json({ error: "email-exists", message: "Email already exists" });
      } else {
        // assuming that all body inputs are valid
        bcrypt.hash(`${password}`, saltRounds, async (err, hash) => {
          if (err) {
            console.log("Error hashing: ", err);
          }
          try {
            const new_user = await client.query(
              "INSERT INTO users (id, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING email, first_name, last_name",
              [uuid.v4(), email, first_name, last_name, hash]
            );
            sendEmail("sign-up", email);
            res.status(200).json(new_user.rows[0]);
          } catch (error) {
            console.error(error.message);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/users/login", async (req, res) => {
    const { email, password, remember } = req.body;
    res.clearCookie("jwt");

    try {
      // check if user exist
      const existed_user = await client.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      if (!existed_user || !existed_user.rows || !existed_user.rows[0]) {
        res.status(400).json({
          error: "email-not-exist",
          message: "User with such email does not exist",
        });
      } else {
        const user = existed_user.rows[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.log("Error compare: ", err);
          }

          if (result) {
            const token = createToken(user.id);
            // if (remember) {
            // res.cookie("jwt", token, {
            // httpOnly - So we wouldn't be able to change it from the client's JS code
            // httpOnly: true,
            // maxAge: maxAge * 1000,
            // secure: false,
            // });
            // res.cookie("jwt", token);
            // }
            const { password, ...userWithoutPassword } = user;
            res.status(200).json({ user: userWithoutPassword, token });
          } else {
            res.status(400).json({
              error: "invalid-password",
              message: "Password is invalid",
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
  app.put("/users/forgot", async (req, res) => {
    const { email } = req.body;

    try {
      // check if user exist
      const existed_user = await client.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );
      if (!existed_user || !existed_user.rows || !existed_user.rows[0]) {
        res.status(400).json({
          error: "email-does-not-exists",
          message: "User with such email does not exist",
        });
      } else {
        const user = existed_user.rows[0];
        const token = createToken(user.id);
        sendEmail("forgot-password", email, token);
        res
          .status(200)
          .json({ message: "An email with reset link has been sent" });
      }
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/users/reset", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const { new_password } = req.body;

    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: "invalid-token", message: "Invalid token" });
      } else {
        const { id } = decodedToken;
        bcrypt.hash(`${new_password}`, saltRounds, async (err, hash) => {
          if (err) {
            console.log("Error hashing: ", err);
          }
          try {
            const updated_user = await client.query(
              "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
              [hash, id]
            );
            if (updated_user.rows[0]) {
              const { password, ...userWithoutPassword } = updated_user.rows[0];

              res.status(200).json(userWithoutPassword);
            } else
              res
                .status(404)
                .json({ error: "user-not-found", message: "User not found" });
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
        });
      }
    });
  });
  app.get("/users/get-user", (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res
          .status(400)
          .json({ error: "invalid-token", message: "Invalid token" });
      } else {
        const { id } = decodedToken;
        try {
          const user = await client.query("SELECT * FROM users WHERE id = $1", [
            id,
          ]);
          if (user.rows[0]) {
            const { password, ...userWithoutPassword } = user.rows[0];

            res.status(200).json(userWithoutPassword);
          } else
            res
              .status(404)
              .json({ error: "user-not-found", message: "User not found" });
        } catch (error) {
          console.error(error.message);
          res.status(400).json({ error: error.message });
        }
      }
    });
  });
};

module.exports = init;
