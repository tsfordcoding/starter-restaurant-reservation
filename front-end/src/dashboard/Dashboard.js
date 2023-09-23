import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import ReservationDetail from "../reservations/ReservationDetail";
import TableDetail from "../tables/TableDetail";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState(date);

  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  const history = useHistory();
  const location = useLocation();
  const searchedDate = location.search.slice(-10);

  function tableClear(tables) {
    let clear = [];
    tables.forEach((table) => {
      if(table.reservation_id) {
        clear.push(table);
      }
    })
    return clear;
  }
  let tableClearToggler = tableClear(tables);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if(currentDate === date) {
          const reservationsReturned = await listReservations({ date }, abortController.signal);
          setReservations(reservationsReturned);
        } else {
          const reservationsReturned = await listReservations({ currentDate }, abortController.signal);
          setReservations(reservationsReturned);
        }
      } catch(error) {
        setError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, history.location]);

  useEffect(() => {
    const abortController = new AbortController();
    
    async function loadTables() {
      try {
        const tablesReturned = await listTables();
        setTables(tablesReturned);
      } catch(error) {
        setError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [history, date, currentDate]);

  useEffect(() => {
    if(searchedDate && searchedDate !== '') {
      setCurrentDate(searchedDate);
    }
  }, [searchedDate, history])

  const previousHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(previous(currentDate));
  };

  const todayHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(date);
  };

  const nextHandler = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(next(currentDate));
  };

  if (reservations) {
    return (
      <main>
        <div className="mb-3">
          <h1>Dashboard</h1>
        </div>

        <div className="d-md-flex mb-3">
          <div className="row-mb-3">
            <h4 className="ml-3">Reservations for date: {currentDate} </h4>
            <div className="">
              <button
                className="btn btn-primary ml-3"
                onClick={previousHandler}
              >
                Previous Day
              </button>
            </div>

            <div className="">
              <button className="btn btn-primary ml-3" onClick={todayHandler}>
                Today
              </button>
            </div>

            <div className="">
              <button className="btn btn-primary ml-3" onClick={nextHandler}>
                Next Day
              </button>
            </div>
          </div>
        </div>
        <ErrorAlert error={error} />
        <div>
          <h4>Reservation List</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Reservation Date</th>
                <th scope="col">Reservation Time</th>
                <th scope="col">Party Size</th>
                <th scope="col">Reservation Status</th>
                <th scope="col">Seat Reservation</th>
                <th scope="col">Edit Reservation</th>
                <th scope="col">Cancel Reservation</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                  <ReservationDetail
                    res={reservation}
                    key={reservation.reservation_id}
                  />
                ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4>Tables List</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Table Name</th>
                <th scope="col">Capacity</th>
                <th scope="col">Reservation ID</th>
                <th scope="col">Table Status</th>
                {tableClearToggler.length ?
                  <th scope="col">Clear Tables</th>
                  :
                  <></>}
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                  <TableDetail
                    table={table}
                    key={table.table_id}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  } else {
    return (
      <div>
        <h4>Dashboard loading...</h4>
      </div>
    );
  }
}

export default Dashboard;
