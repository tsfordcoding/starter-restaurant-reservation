import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listReservations, listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservationsError, setReservationsError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const [currentReservation, setCurrentReservation] = useState({});
  const [tableFormData, setTableFormData] = useState({});
  const [seatError, setSeatError] = useState(null);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    return listReservations(abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    return listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
  }

  function setCurrent() {
    const current = reservations.find(
      (reservation) => reservation.reservation_id === Number(reservation_id)
    );
    setCurrentReservation(current);
  }

  useEffect(loadTables, []);
  useEffect(loadReservations, []);
  useEffect(setCurrent, [reservations, reservation_id]);

  function handleSubmit(event) {
    event.preventDefault();

    const tableObject = JSON.parse(tableFormData);
    if (currentReservation.people <= tableObject.capacity) {
      updateSeat(tableObject.table_id, reservation_id)
        .then((response) => {
          const newTables = tables.map((table) => {
            return table.table_id === response.table_id ? response : table;
          });
          setTables(newTables);
          history.push("/dashboard");
        })
        .catch(setSeatError);
    } else {
        setSeatError(new Error('Capacity not sufficient'));
    }
  }

  if (tables) {
    return (
      <main>
        <div className="mb-3">
          <h1>Reservation Seat Form</h1>
        </div>
        <ErrorAlert error={reservationsError} />
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={seatError} />

        <div className="mb-3">
          <h3>Current Reservation: {reservation_id}</h3>
        </div>

        <form className="form-group" onSubmit={handleSubmit}>
          <div className="col mb-3">
            <label className="form-label" htmlFor="table_id">
              Select Table
            </label>
            <select
              id="table_id"
              className="form-control"
              name="table_id"
              onChange={(event) => setTableFormData(event.target.value)}
            >
              <option value="">Table Name - Capacity</option>
              {tables.map((table) => (
                <option
                  key={table.table_id}
                  value={JSON.stringify(table)}
                  required={true}
                >
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </select>
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
      </main>
    );
  } else {
    return (
        <div>
            <h1>No open tables to seat.</h1>
        </div>
    );
  }
}

export default ReservationSeat;