/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  if(req.body.data) {
    return next();
  }
  next({ 
    status: 400, 
    message: "body must have data property" 
  });
}

function hasFirstName(req, res, next) {
  if(req.body.data.first_name) {
    return next();
  } 
  next({
    status: 400,
    message: "first_name",
  })
}

async function create(req, res, next) {
  const newReservation = await reservationsService.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

async function list(req, res) {
  const { date } = req.query;
    
  const data = await reservationsService.list(date);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, hasFirstName, asyncErrorBoundary(create)],
};
