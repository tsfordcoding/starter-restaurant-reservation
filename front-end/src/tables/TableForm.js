import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({
  formData,
  handleNameChange,
  handleCapacityChange,
  handleSubmit,
}) {

  const history = useHistory();

  return (
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label mr-2" htmlFor="table_name">
              Table Name:
            </label>
            <input
              type="text"
              id="table_name"
              className="form-control"
              name="table_name"
              onChange={handleNameChange}
              value={formData.table_name}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label mr-2" htmlFor="capacity">
              Table Capacity:
            </label>
            <input
              type="number"
              id="capacity"
              className="form-control"
              name="capacity"
              min="1"
              onChange={handleCapacityChange}
              value={formData.capacity}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mr-1 mb-3"
          >
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
  );
}

export default TableForm;
