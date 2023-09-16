const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tablesService = require("./tables.service");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "body must have data property",
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

    if(capacity && Number.isInteger(capacity) && capacity > 0) {
        return next();
    }
    next({
        status: 400,
        message: `capacity`,
    })
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



module.exports = {
    create: [
        hasData,
        hasTableName,
        hasCapacity,
        asyncErrorBoundary(create),
    ],
    list: asyncErrorBoundary(list),
}