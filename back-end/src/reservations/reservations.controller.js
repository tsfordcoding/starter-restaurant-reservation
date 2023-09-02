/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { date } = req.query;
    
  const data = await reservationsService.list(date);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
