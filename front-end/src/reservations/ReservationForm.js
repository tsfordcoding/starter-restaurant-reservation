import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm() {
  const history = useHistory();

  return (
    <div>
      <form>
        <div className="form-group">
          <label className="mr-2" htmlFor="first_name">
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            className="form-control"
            name="first_name"
            onChange={handleChange}
            value={formData.first_name}
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="last_name">
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            className="form-control"
            name="last_name"
            onChange={handleChange}
            value={formData.last_name}
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="mobile_number">
            Mobile Number:
          </label>
          <input
            type="tel"
            id="mobile_number"
            className="form-control"
            name="mobile_number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="reservation_date">
            Date of Reservation (Closed on Tuesdays):
          </label>
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            id="reservation_date"
            className="form-control"
            name="reservation_date"
            onChange={handleChange}
            value={formData.reservation_date}
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="reservation_time">
            Time of Reservation:
          </label>
          <input
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            id="reservation_time"
            className="form-control"
            name="reservation_time"
            onChange={handleChange}
            value={formData.reservation_time}
            required
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="people">
            Number of People:
          </label>
          <input
            type="number"
            id="people"
            className="form-control"
            name="people"
            onChange={handleChange}
            value={formData.people}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary mr-1 mb-3"
          onClick={(event) => handleSubmit(event)}
        >
          Submit
        </button>

        <button
          className="btn btn-secondary mr-1 mb-3"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default ReservationForm;
