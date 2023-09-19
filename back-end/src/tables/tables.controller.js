const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");

// ---- Middleware Functions

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "body must have data property",
  });
}

function hasReservationId(req, res, next) {
    const { reservation_id } = req.body.data;

    if(reservation_id) {
        return next();
    }
    next({
        status: 400,
        message: "reservation_id",
    });
}

function hasTableName(req, res, next) {
    const { table_name } = req.body.data;
    
    if(table_name && table_name.length >= 2) {
        return next();
    }
    next({
        status: 400,
        message: `table_name`,
    })
}

function hasCapacity(req, res, next) {
    const { capacity } = req.body.data;

    if(capacity && Number.isInteger(capacity) && capacity >=1) {
        return next();
    }
    next({
        status: 400,
        message: `capacity`,
    })
}

async function tableExists(req, res, next) {
    const table_id = req.params.table_id;

    const table = await tablesService.readTable(table_id);
    
    if(table) {
        res.locals.table = table;
        return next();
    }
    next({
        status: 400,
        message: `table_id does not exist`,
    });
}

async function reservationExists(req, res, next) {
    const { reservation_id } = req.body.data;
    const reservation = await tablesService.readReservation(reservation_id);

    if(reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({
        status: 404,
        message: `999`,
    })
}

async function seatedReservation(req, res, next) {
    const { reservation_id } = req.body.data;
    const seated = await tablesService.readTableByReservation(reservation_id);

    if(!seated) {
        return next();
    }
    next({
        status: 400,
        message: `seated`,
    })
}

async function openTable(req, res, next) {
    const table = res.locals.table;

    if(!table.reservation_id) {
        return next();
    }
    next({
        status: 400,
        message: `occupied`,
    });
}

async function tableHasEnoughSeats(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;

    if(reservation.people > table.capacity) {
        next({
            status: 400,
            message: `capacity`,
        });
    }
    return next();
}

// ---- CRUD Functions

function read(req, res) {
    const data = res.locals.table;
    res.json({ data });
}

async function list(req, res) {
    const data = await tablesService.list();
    res.json({ data });
}

async function create(req, res) {
    const newTable = req.body.data;
    const data = await tablesService.create(newTable);
    res.status(201).json({ data });
}

async function update(req, res) {
    const { reservation_id } = req.body.data;
    const { table_name, capacity } = res.locals.table;
    const { table_id } = req.params;

    const tableUpdate = {
        table_id,
        table_name,
        capacity,
        status: "occupied",
        reservation_id
    };

    const reservationUpdate = { ...res.locals.reservation, status: "seated" };
    const updatedTable = await tablesService.update(tableUpdate, reservationUpdate);
    res.json( { data: updatedTable });
}



module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasData,
        hasTableName,
        hasCapacity,
        asyncErrorBoundary(create),
    ],
    read: [asyncErrorBoundary(tableExists), read],
    update: [
        hasData,
        hasReservationId,
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(openTable),
        asyncErrorBoundary(tableHasEnoughSeats),
        asyncErrorBoundary(seatedReservation),
        asyncErrorBoundary(update),
    ],
}