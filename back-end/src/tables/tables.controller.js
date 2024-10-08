const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");

// ---- Middleware Validation Functions

const VALID_PROPERTIES = [
  "table_id",
  "table_name",
  "capacity",
  "reservation_id",
];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidColumns = Object.keys(data).filter(
    (column) => !VALID_PROPERTIES.includes(column)
  );

  if (invalidColumns.length) {
    return next({
      status: 400,
      message: `Invalid column(s): ${invalidColumns.join(", ")}`,
    });
  }
  next();
}

function hasProperties(...properties) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      properties.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A '${property}' property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

const hasRequiredProperties = hasProperties("table_name", "capacity");

function validCapacity(req, res, next) {
  const capacity = req.body.data.capacity;

  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: `capacity must be a number`,
    });
  }
  next();
}

function validTableName(req, res, next) {
  const tableName = req.body.data.table_name;

  if (tableName.length <= 1) {
    next({
      status: 400,
      message: `table_name must be more than one character`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);

  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table id ${table_id} cannot be found.`,
  });
}

async function reservationIdExists(req, res, next) {
  const reservation_id = req.body.data.reservation_id;
  const reservation = await tablesService.readReservation(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

const hasReservationId = hasProperties("reservation_id");

function validPeopleToTableCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;

  if (capacity < people) {
    return next({
      status: 400,
      message: `Table does not have sufficient capacity.`,
    });
  }
  return next();
}

function tableNotOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;

  if (reservation_id) {
    return next({
      status: 400,
      message: `Table is occupied.`,
    });
  }
  return next();
}

function tableOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;

  if (!reservation_id) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
  return next();
}

function notSeatedStatus(req, res, next) {
  const { status } = res.locals.reservation;

  if (status === "seated") {
    return next({
      status: 400,
      message: `reservation_status is ${status}.`,
    });
  }
  next();
}

// ---- CRUD Functions

async function create(req, res, next) {
  const newTable = { ...req.body.data };
  const data = await tablesService.create(newTable);
  res.status(201).json({ data });
}

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await tablesService.update(updatedTable);
  res.status(200).json({ data });
}

async function destroy(req, res) {
  const table_id = res.locals.table.table_id;
  const data = await tablesService.destroy(table_id);
  res.sendStatus(204);
}

async function deleteSeat(req, res) {
  const { table_id, reservation_id } = res.locals.table;
  const status = "finished";
  await tablesService.updateStatus(reservation_id, status);
  await tablesService.deleteSeat(table_id);
  res.status(200).json({});
}

async function updateStatusToSeated(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };

  await tablesService.updateStatus(
    updatedReservation.reservation_id,
    updatedReservation.status
  );
  next();
}

module.exports = {
  create: [
    hasValidProperties,
    hasRequiredProperties,
    validCapacity,
    validTableName,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  update: [
    hasValidProperties,
    asyncErrorBoundary(tableExists),
    hasReservationId,
    asyncErrorBoundary(reservationIdExists),
    validPeopleToTableCapacity,
    notSeatedStatus,
    tableNotOccupied,
    updateStatusToSeated,
    asyncErrorBoundary(update),
  ],
  deleteSeat: [
    asyncErrorBoundary(tableExists),
    tableOccupied,
    asyncErrorBoundary(deleteSeat),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
