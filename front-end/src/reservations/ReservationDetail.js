import React, { useState } from 'react';

function ReservationDetail({ reservation }) {
    const [currentReservation, setCurrentReservation] = useState(reservation);

    return (
      <>
        <tr key={currentReservation.reservation_id}>
          <th scope="row"> {reservation.reservation_id} </th>
          <td> {currentReservation.first_name} </td>
          <td> {currentReservation.last_name} </td>
          <td> {currentReservation.mobile_number} </td>
          <td> {currentReservation.reservation_date} </td>
          <td> {currentReservation.reservation_time} </td>
          <td> {currentReservation.people} </td>
          <td>
            <button className="btn btn-primary"> Edit </button>
          </td>
        </tr>
      </>
    );
}

export default ReservationDetail;