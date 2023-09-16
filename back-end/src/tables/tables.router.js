/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/:table_id([0-9]+)/seat").put(controller.updateSeat);
router.route("/").get(controller.list).post(controller.create);

module.exports = router;