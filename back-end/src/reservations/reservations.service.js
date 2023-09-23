const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*");
}

function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished"})
    .orderBy("reservation_time", "asc");
};

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
};

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .then((reservations) => reservations[0]);
};

function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((updatedRes) => updatedRes[0]);
}

function updateStatus(reservationId, status) {
  return knex("reservations")
    .where({ reservation_id: reservationId })
    .update({ status: status }, "*")
    .then((updatedStatus) => updatedStatus[0]);
}

function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() - ', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`  
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  listByDate,
  create,
  read,
  update,
  updateStatus,
  listByPhone,
};
