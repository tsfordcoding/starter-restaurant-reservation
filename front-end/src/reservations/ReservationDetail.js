import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { updateReservationStatus, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationDetail({ res }) {
  const [reservation, setReservation] = useState(res);
  const [error, setError] = useState(null);
  const history = useHistory();

  function handleCancelReservation(event) {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateReservationStatus(
        { status: "cancelled" },
        reservation.reservation_id
      )
        .then(() => {
          listTables();
          history.push("/dashboard");
        })
        .catch(setError);
    }
  }

  useEffect(() => {
    setReservation(reservation);
  }, [reservation, history]);

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row">{reservation.reservation_id}</th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td>{reservation.people}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-primary">Seat</button>
            </a>
          ) : (
            <div></div>
          )}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a href={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-primary">Edit</button>
            </a>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          {reservation.status === 'booked' ?
          <button className="btn btn-danger ml-2" onClick={handleCancelReservation}>Cancel</button>  
            :
            <></>
        }
        </td>
      </tr>
    </>
  );
}

export default ReservationDetail;
