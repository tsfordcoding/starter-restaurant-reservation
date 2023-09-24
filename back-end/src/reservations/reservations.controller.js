/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Middleware Functions for Validation

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidColumns = Object.keys(data).filter(
    (column) => !VALID_PROPERTIES.includes(column)
  );

  if(invalidColumns.length) {
    return next({
      status: 400,
      message: `Invalid column(s): ${invalidColumns.join(", ")}`,
    })
  }
  next();
}

function hasProperties(...properties) {
  return function(req, res, next) {
    const { data = {} } = req.body;
    
    try{
      properties.forEach((property) => {
        if(!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch(error) {
      next(error);
    }
  };
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
);

function validDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const isDate = Date.parse(reservation_date);

  if(!Number.isNaN(isDate)) {
    res.locals.reservation_date = reservation_date;
    return next();
  }
  next({
    status: 400,
    message: `reservation_date is not a valid date`,
  })
}

function validMobileNumber(req, res, next) {
  const { mobile_number } = req.body.data;
  const isPhoneNumber = mobile_number.match(/^[1-9]\d{2}-?\d{3}-?\d{4}$/);

  if(isPhoneNumber) {
    return next();
  } else {
    next({
      status: 400,
      message: `Please enter valid mobile number xxx-xxx-xxxx`,
    })
  }
}

function mobileIsNumber(req, res, next) {
  const { mobile_number } = req.body.data;
  const inputArray = [];

  mobile_number.split("").forEach(character => {
    if(Number(character)) {
      inputArray.push(character);
    }
  });

  const testString = inputArray.join('');

  const isNumber = Number(testString);

  if(isNumber) {
    return next();
  } else {
    next({
      status: 400,
      message: `Please enter valid mobile number xxx-xxx-xxxx`,
    });
  }
}

function validTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const isTime = reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

  if(isTime) {
    res.locals.reservation_time = reservation_time;
    return next();
  } else {
    next({
      status: 400,
      message: `reservation_time is not a valid time.`,
    });
  }
}

function peopleIsNumber(req, res, next) {
  const { people } = req.body.data;

  if(typeof people !== "number" || people < 0) {
    next({
      status: 400,
      message: `people must be a number and greater than zero.`,
    })
  } else {
    res.locals.people = people;
    return next();
  }
}

function noPastReservations(req, res, next) {
  const { reservation_date, reservation_time } = res.locals;
  const now = Date.now();
  const bookedTime = Date.parse(`${reservation_date} ${reservation_time}`);

  if(bookedTime > now) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Reservations must be made in the future`,
    })
  }
}

function closedOnTuesday(req, res, next) {
  const { reservation_date, reservation_time } = res.locals;
  const day = new Date(`${reservation_date} ${reservation_time}`);

  if(day.getDay() !== 2) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Restaurant is closed on Tuesdays.`,
    });
  }
}

function reservationDuringOpenHours(req, res, next) {
  const { reservation_time } = res.locals;
  
  if(reservation_time < "10:30:00" || reservation_time > "21:30:00") {
    return next({
      status: 400,
      message: "Reservations can only be made between 10:30 am and 9:30 pm"
    });
  } else {
    return next();
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);

  if(reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  })
}

function statusNotBooked(req, res, next) {
  const { status } = req.body.data;
  
  if(status) {
    if(status !== "booked") {
      return next({
        status: 400,
        message: `Cannot seat a reservation with a status of ${status}.`,
      });
    } else if(status === "booked") {
      return next();
    }
  }
  next();
}

function statusNotFinished(req, res, next) {
  const { status } = res.locals.reservation;

  if(status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: `Status cannot be updated if it is finished.`
  });
}

function validStatus(req, res, next) {
  const { status } = req.body.data;

  if(
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    return next();
  }
  next({
    status: 400,
    message: `${status} is not a valid status.`
  })
}

// CRUD Functions

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data;

  if(date) {
    data = await reservationsService.listByDate(date);
  } else if(mobile_number) {
    data = await reservationsService.listByPhone(mobile_number);
  } else {
    data = await reservationsService.list();
  }
  res.status(200).json({ data });
}

async function create(req, res, next) {
  const newReservation = { ...req.body.data };
  const data = await reservationsService.create(newReservation);
  res.status(201).json({ data });
}

async function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  
  const data = await reservationsService.update(updatedReservation);
  res.status(200).json({ data });
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await reservationsService.updateStatus(reservation_id, status);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    validDate,
    validTime,
    validMobileNumber,
    validMobileNumber,
    mobileIsNumber,
    peopleIsNumber,
    closedOnTuesday,
    noPastReservations,
    reservationDuringOpenHours,
    statusNotBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    hasRequiredProperties,
    validDate,
    validTime,
    validMobileNumber,
    mobileIsNumber,
    peopleIsNumber,
    closedOnTuesday,
    noPastReservations,
    reservationDuringOpenHours,
    statusNotBooked,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusNotFinished,
    validStatus,
    asyncErrorBoundary(updateStatus),
  ],
};
