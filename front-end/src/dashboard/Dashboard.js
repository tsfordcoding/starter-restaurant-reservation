import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { today } from "../utils/date-time";
import { previous, next } from "../utils/date-time";
import { Link, useHistory } from "react-router-dom";
import ReservationDetail from "./ReservationDetail";
import TableDetail from "./TableDetail";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);
  const [cancelError, setCancelError] = useState(null);

  let date = today();
  const query = useQuery().get("date");

  if (query) {
    date = query;
  }

  // Load Reservations and Tables

  useEffect(loadDashBoard, [date]);

  function loadDashBoard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  // Handlers

  async function handleFinish({ table_id, reservation_id }) {
    const confirmationWindow = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if (confirmationWindow) {
      try {
        await finishTable(table_id);
        await updateReservationStatus(reservation_id, "finished");
      } catch (error) {
        setTablesError([error]);
      }

      history.push("/");
    }
  }

  async function handleCancel({ reservation_id }) {
    const confirmationWindow = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirmationWindow) {
      try {
        await updateReservationStatus(reservation_id, "cancelled");
      } catch (error) {
        setCancelError([error]);
      }

      history.push("/");
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservation for date</h4>
      </div>
      <div className="contrainer">
        <Link
          to={`/dashboard/?date=${previous(date)}`}
          className="btn btn-dark"
        >
          Previous
        </Link>

        <Link to={`/dashboard`} className="btn btn-dark">
          Today
        </Link>

        <Link to={`/dashboard/?date=${next(date)}`} className="btn btn-dark">
          Next
        </Link>
      </div>
      <br />
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={cancelError} />

      <ReservationDetail
        reservations={reservations}
        date={date}
        handleCancel={handleCancel}
      />
      <br />
      <TableDetail tables={tables} handleFinish={handleFinish} />
    </main>
  );
}

export default Dashboard;
