import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function AddReservation() {
  const history = useHistory();
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState(initialReservationState);

  const handleChange = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createReservation({ 
        ...reservation,
        people: parseInt(reservation.people) 
      })
      .then(() => {
        history.push(`/dashboard?date=${reservation.reservation_date}`);
      })
      .catch(setError);
  }

  return (
    <div className="container">
      <h1 className="mt-3 mb-3">Create a Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
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
            required={true}
            value={reservation.first_name}
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
            required={true}
            value={reservation.last_name}
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
            required={true}
            value={reservation.mobile_number}
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="reservation_date">
            Date of Reservation:
          </label>
          <input
            type="date"
            id="reservation_date"
            className="form-control"
            name="reservation_date"
            onChange={handleChange}
            required={true}
            value={reservation.reservation_date}
          />
        </div>

        <div className="form-group">
          <label className="mr-2" htmlFor="reservation_time">
            Time of Reservation:
          </label>
          <input
            type="time"
            id="reservation_time"
            className="form-control"
            name="reservation_time"
            onChange={handleChange}
            required={true}
            value={reservation.reservation_time}
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
            required={true}
            value={reservation.people}
          />
        </div>

        <button type="submit" className="btn btn-primary mr-1 mb-3">
          Submit
        </button>

        <button type="button" onClick={() => history.goBack()} className="btn btn-secondary mr-1 mb-3">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddReservation;
