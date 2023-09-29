import React from "react";
import { useHistory } from "react-router-dom";

function SearchForm({ formData, handleChange, handleSubmit }) {
  const history = useHistory();

  return (
    <>
      <form>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:</label>
          <div>
            <input
              type="text"
              id="mobile_number"
              className="form-control"
              name="mobile_number"
              onChange={handleChange}
              value={formData.mobile_number}
              required
            />
          </div>

          <div>
            <button
              className="btn btn-primary mr-1 mb-3"
              type="submit"
              onClick={(event) => handleSubmit(event)}
            >
              Find
            </button>

            <button
              className="btn btn-secondary mr-1 mb-3"
              type="button"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default SearchForm;