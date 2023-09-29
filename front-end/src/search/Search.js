import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { searchByMobileNumber } from "../utils/api";
import SearchForm from "./SearchForm";
import ReservationDetail from "../dashboard/ReservationDetail";

function Search() {
  const initialFormState = {
    mobile_number: " ",
  };

  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Handlers

  const handleChange = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const mobile_number = formData.mobile_number;
      const reservationsFound = await searchByMobileNumber(mobile_number);
      setReservations(reservationsFound);
      setSubmitted(true);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <main>
      <div>
        <h1>Search by Mobile Number</h1>
      </div>

      <div>
        <SearchForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        {error.length > 0 && <ErrorAlert error={error} />}

        {reservations.length > 0 && (
          <ReservationDetail reservations={reservations} />
        )}

        {submitted &&
          reservations.length <= 0 &&
          `No reservations found for mobile number: ${formData.mobile_number}`}
      </div>
    </main>
  );
}

export default Search;
