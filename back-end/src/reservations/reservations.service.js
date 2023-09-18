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

function list() {
  return knex("reservations").select("*");
}

function listByDate(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .select("*")
    .orderBy("reservation_time");
};

function listByPhone(mobile_number) {
  return knex("reservations")
    .select("*")
    .where({ mobile_number })
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .then((reservations) => reservations[0]);
};

module.exports = {
  read,
  list,
  listByDate,
  listByPhone,
  create,
};
