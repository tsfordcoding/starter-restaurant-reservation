const knex = require("../db/connection");

function create(newReservation) {
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

function list(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .select("*")
    .orderBy("reservation_time");
};

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .then((reservations) => reservations[0]);
};

module.exports = {
  read,
  list,
  create,
};
