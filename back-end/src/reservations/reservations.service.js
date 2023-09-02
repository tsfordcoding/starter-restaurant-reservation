const knex = require("../db/connection");

const create = (newReservation) => {
    return knex("reservations").insert(newReservation).returning("*");
}

const list = (date) => {
    return knex("reservations").where("reservation_date", date).select("*").orderBy("reservation_time");
}

module.exports = {
    list,
    create,
}