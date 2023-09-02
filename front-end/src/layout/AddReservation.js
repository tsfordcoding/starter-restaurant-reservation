import React from "react";

function AddReservation() {
  return (
    <div className="container">
      <h1 className="mt-3 mb-3">Add a Reservation</h1>

      <form>
        <div className="form-group">
          <label className="mr-2" for="first_name">
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            className="form-control"
            name="first_name"
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" for="last_name">
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            className="form-control"
            name="last_name"
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" for="mobile_number">
            Mobile Number:
          </label>
          <input
            type="tel"
            id="mobile_number"
            className="form-control"
            name="mobile_number"
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" for="reservation_date">
            Date of Reservation:
          </label>
          <input
            type="date"
            id="reservation_date"
            className="form-control"
            name="reservation_date"
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" for="reservation_time">
            Time of Reservation:
          </label>
          <input
            type="time"
            id="reservation_time"
            className="form-control"
            name="reservation_time"
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" for="people">
            Number of People:
          </label>
          <input
            type="number"
            id="people"
            className="form-control"
            name="people"
            min="1"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary mr-1 mb-3">
          Submit
        </button>

        <button type="button" class="btn btn-secondary mr-1 mb-3">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddReservation;
