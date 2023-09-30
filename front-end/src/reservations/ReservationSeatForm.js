import React from "react";
import { useHistory } from "react-router-dom";

function ReservationSeatForm({ tables, handleSubmit, handleChange }) {
  const history = useHistory();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Table:</label>
          <select name="table_id" onChange={handleChange}>
            <option value="">Table Name - Capacity</option>
            {tables.map((table) => (
              <option
                key={table.table_id}
                value={JSON.stringify(table)}
                require={true}
              >
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="btn btn-primary"
            type="submit"
          >
            Submit
          </button>

          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationSeatForm;