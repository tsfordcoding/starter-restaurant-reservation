import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { 
  listTables, 
  readReservation,
  updateSeat,
  updateReservationStatus, 
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationSeatForm from "./ReservationSeatForm";


function ReservationSeat() {
  const params = useParams();
  const reservation_id = params.reservation_id;
  const history = useHistory();

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);
  const [formData, setFormData] = useState({});
  const [reservation, setReservation] = useState({});
  const [reservationError, setReservationError] = useState([]);

  // Handlers

  const handleChange = ({ target }) => {
    setFormData(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const tableData = JSON.parse(formData);
      const response = await updateSeat(
        tableData.table_id,
        reservation_id,
      );
      response.status = "Occupied";
      await updateReservationStatus(reservation_id, "seated");
      history.push("/dashboard");
    } catch(error) {
      setTablesError(error);
    }
  };

  // Load Tables

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    
    return () => abortController.abort();
  }

  useEffect(loadReservation, [reservation_id]);

  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    
    return () => abortController.abort();
  }

  if (tables) {
    return (
      <main>
        <h1>Seat Reservation</h1>
        <h3>
          Reservation ID: {reservation_id} Party Size: {reservation.people}
        </h3>
        <div>
          <ErrorAlert error={tablesError} />
          <ErrorAlert error={reservationError} />
          <ReservationSeatForm
            tables={tables}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
          />
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h3>There are no tables currently available.</h3>
      </div>
    );
  }
}

export default ReservationSeat;