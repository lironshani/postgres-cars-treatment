const client = require("./db");

const init = (app) => {
  client.connect();
  app.post("/treatments", async (req, res) => {
    try {
      const { treatment_information, date, worker_email, car_number } =
        req.body;
      // client.connect();
      const new_treatment = await client.query(
        "INSERT INTO treatments (treatment_information,date ,worker_email ,car_number) VALUES ($1, $2, $3, $4) RETURNING *",
        [treatment_information, date, worker_email, car_number]
      );
      res.json(new_treatment.rows[0]);
    } catch (error) {
      console.error(error.message);
      client.end();
    }
  });
  app.get("/treatments", async (req, res) => {
    try {
      // client.connect();
      const all_treatments = await client.query("SELECT * FROM treatments");
      res.json(all_treatments.rows);
    } catch (error) {
      console.error(error.message);
      client.end();
    }
  });
  app.get("/treatments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // client.connect();
      const treatment = await client.query(
        "SELECT * FROM treatments WHERE treatment_number=$1",
        [id]
      );
      res.json(treatment.rows[0]);
    } catch (error) {
      console.error(error.message);
      client.end();
    }
  });
  app.put("/treatments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { treatment_information, date, worker_email, car_number } =
        req.body;
      // client.connect();
      const updated_treatment = await client.query(
        "UPDATE treatments SET treatment_information = $1, date = $2, worker_email = $3, car_number = $4 WHERE treatment_number = $5 RETURNING *",
        [treatment_information, date, worker_email, car_number, id]
      );
      res.json(updated_treatment.rows[0]);
    } catch (error) {
      console.error(error.message);
      client.end();
    }
  });
  app.delete("/treatments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      // client.connect();
      await client.query("DELETE FROM treatments WHERE treatment_number=$1", [
        id,
      ]);
      res.json(`Treatments id=${id} was deleted!`);
    } catch (error) {
      console.error(error.message);
      client.end();
    }
  });
  // client.end();
};

module.exports = init;
