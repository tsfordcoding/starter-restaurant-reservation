import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function AddTable() {
  const [error, setError] = useState(null);
  const history = useHistory();
  const [table, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  function handleChange({ target }) {
    setTable({
      ...table,
      [target.name]: target.value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    createTable({
        ...table,
        capacity: parseInt(table.capacity),
    })
      .then(() => {
        history.push(`/dashboard`);
      })
      .catch(setError);
  }

  return (
    <main>
      <div className="container">
        <h1 className="mt-3 mb-3">Create a Table</h1>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="form-group">
          <div className="form-group">
            <label className="form-label mr-2" htmlFor="table_name">
              Table Name
            </label>
            <input
              type="text"
              id="table_name"
              className="form-control"
              name="table_name"
              onChange={handleChange}
              required={true}
              value={table.table_name}
            />
          </div>
          <div className="form-group">
            <label className="form-label mr-2" htmlFor="capacity">
              Table Capacity
            </label>
            <input
              type="text"
              id="capacity"
              className="form-control"
              name="capacity"
              onChange={handleChange}
              required={true}
              value={table.capacity}
            />
          </div>

          <button type="submit" className="btn btn-primary mr-1 mb-3">
            Submit
          </button>

          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-secondary mr-1 mb-3"
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddTable;
