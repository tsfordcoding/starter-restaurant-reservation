const knex = require("../db/connection");

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((createdTable) => createdTable[0]);
}

function list() {
    return knex("tables").select("*").orderBy("table_name", "asc")
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id: table_id })
        .then((selectedTables) => selectedTables[0]);
}

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
        .then((updatedTables) => updatedTables[0]);
}

function readReservation(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .then((selectedReservation) => selectedReservation[0]);
}

function destroy(table_id) {
    return knex("tables").where({ table_id }).del();
}

function deleteSeat(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .update({ reservation_id: null });
}

function updateStatus(reservationId, status) {
    return knex("reservations")
        .where({ reservation_id: reservationId })
        .update({ status: status }, "*")
        .then((updatedStatus) => updatedStatus[0]);
}

module.exports = {
    create,
    list,
    update,
    read,
    readReservation,
    destroy,
    deleteSeat,
    updateStatus,
}