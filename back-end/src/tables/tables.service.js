const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then(([createdTable]) => createdTable);
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function readTable(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function readReservation(reservation_id) {
    return knex("reservations as r")
        .select("*")
        .where({ reservation_id })
        .first();
}

function readTableByReservation(reservation_id) {
    return knex("tables")
        .where({ reservation_id })
        .whereExists(knex.select("*").from("tables").where({ reservation_id }))
        .then((result) => result[0]);
}

async function update(updatedTable, updatedReservation) {
    const { table_id, reservation_id } = updatedTable;
    await knex("tables")
        .where({ table_id })
        .update(updatedTable, "*");
    
    await knex("reservations")
        .where({ reservation_id })
        .update(updatedReservation, "*")

    return read(table_id);
}
module.exports = {
    create,
    list,
    read,
    readTable,
    readReservation,
    readTableByReservation,
    update,
}