const knex = require("../db/connection");

function list() {
    return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
    return knex("tables")
        .insert({
            ...newTable,
            "status": newTable.reservation_id ? "occupied" : "open",
        })
        .returning("*")
        .then(([createdTable]) => createdTable);
}

function read(table_id) {
    return knex("tables")
        .leftJoin("reservations as r", "r.reservation_id", "t.reservation_id")
        .select(
            "t.table_id",
            "t.table_name",
            "t.capacity",
            "t.reservation_id",
            "r.first_name",
            "r.last_name",
            "r.mobile_number",
            "r.reservation_date",
            "r.reservation_time",
            "r.people",
            "r.status",
            "r.created_at as reservation_created",
            "r.updaate_at as reservation_updated"
        )
        .where({ table_id })
        .then((readTable) => readTable[0]);
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
        .then((readTable) => readTable[0]);
}

async function update(reservation_id, table_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update(
      {
        reservation_id: reservation_id,
        table_status: "occupied",
      },
      "*"
    )
    .then(() =>
      trx("reservations").where({ reservation_id }).update({ status: "seated" })
    )
    .then(trx.commit)
    .catch(trx.rollback);
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