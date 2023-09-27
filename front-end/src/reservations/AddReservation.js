import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function AddReservation() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "1",
    status: "booked",
  }

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(false);

  // Handlers 

  const handleChange = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const response = await createReservation(
        formData,
        abortController.signal
      );
      history.push(
        `/dashboard/?date=${response.reservation_date.slice(0, 10)}`
      );
    } catch(error) {
      setError(error);
    }
  }

  return (
    <div>
      <div>
        <h1>Create a New Reservation</h1>
      </div>
      <div>
        <ErrorAlert error={error} />
        <ReservationForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default AddReservation;
