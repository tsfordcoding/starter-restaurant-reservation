import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
        status: "",
    };

    const params = useParams();
    const reservation_id = params.reservation_id;
    const history = useHistory();

    const [reservationError, setReservationError] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormState });
    const [error, setError] = useState(null);

    // Load Reservation
    
    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setReservationError(null);
        readReservation(reservation_id, abortController.signal)
            .then((data) => 
                setFormData({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    mobile_number: data.mobile_number,
                    reservation_date: data.reservation_date.slice(0, 10),
                    reservation_time: data.reservation_time.slice(0, 5),
                    people: data.people,
                    status: data.status,
                })
            )
            .catch(setReservationError);
        return () => abortController.abort();
    }

    // Handlers

    const handleChange = ({ target }) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            [target.name]: target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        const abortController = new AbortController();
        try {
            const response = await updateReservation(
                reservation_id,
                formData,
                abortController.signal
            );

            history.push(
                `/dashboard/?date=${response.reservation_date.slice(0, 10)}`
            );
        } catch(error) {
            setError(error);
        }
    };

    return (
        <main>
            <div>
                <h1>Edit Reservation</h1>
            </div>

            <div>
                <ErrorAlert error={error} />
                <ErrorAlert error={reservationError} />
            </div>

            <div>
                <ReservationForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            </div>
        </main>
    );
}

export default EditReservation;