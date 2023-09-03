const knex = require("../db/connection");

const create = (newReservation) => {
  return knex("reservations")
    .insert(newReservation)
    .returning([
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ])
    .then(([createdReservation]) => createdReservation);
};

const list = (date) => {
  return knex("reservations")
    .where("reservation_date", date)
    .select("*")
    .orderBy("reservation_time");
};

module.exports = {
  list,
  create,
};
