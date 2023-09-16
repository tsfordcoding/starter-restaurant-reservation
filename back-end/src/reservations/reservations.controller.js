/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "body must have data property",
  });
}

function hasFirstName(req, res, next) {
  const { first_name } = req.body.data;
  
  if (first_name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name",
  });
}

function hasLastName(req, res, next) {
  const { last_name } = req.body.data;
  
  if (last_name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name",
  });
}

function hasMobilePhone(req, res, next) {
  const { mobile_number } = req.body.data;

  if (mobile_number) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number",
  });
}

function hasValidReservationDate(req, res, next) {
  const { reservation_date } = req.body.data;

  if(!reservation_date) {
    return next({
      status: 400,
      message: "reservation_date",
    });
  }

  const isValidDate = !isNaN(Date.parse(reservation_date));

  if(isValidDate) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date",
  });
}

function closedOnTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekDay = new Date(date).getUTCDay();

  if(weekDay !== 2) {
    return next();
  }
  next({
    status: 400,
    message: `closed`,
  });
}

function futureReservations(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now();
  const futureReservation = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();

  if(futureReservation > now) {
    return next();
  }
  next({
    status: 400,
    message: `future`,
  })
}

function hasValidReservationTime(req, res, next) {
  const { reservation_time } = req.body.data;

  const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  if(reservation_time && reservation_time.match(timePattern)) {
    return next();
  }
  next({
      status: 400,
      message: "reservation_time",
  });
}

function reservationDuringOpenHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const open = "10:30";
  const close = "21:30";

  if(time >= open && time <= close) {
    return next();
  }
  next({
    status: 400,
    message: `Reservation must be during open hours`,
  })
}

function hasValidPeople(req, res, next) {
  const { people } = req.body.data;

  if(people && Number.isInteger(people) && people > 0) {
    return next();
  }
  next({
    status: 400,
    message: "people",
  });
}

async function create(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

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
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobilePhone,
    hasValidReservationDate,
    hasValidReservationTime,
    closedOnTuesday,
    futureReservations,
    reservationDuringOpenHours,
    hasValidPeople,
    asyncErrorBoundary(create),
  ],
};
