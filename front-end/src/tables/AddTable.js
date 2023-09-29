import React, { useState } from "react";
import TableForm from "./TableForm";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function AddTable() {
  
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: "1",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [error, setError] = useState(false);

  // Handlers

  const handleNameChange = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: target.value,
    }));
  };

  const handleCapacityChange = ({ target }) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [target.name]: Number(target.value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    try {
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
    } catch(error) {
      setError(error);
    }
  };

  return (
    <div>
      <div>
        <h1>Create a Table</h1>
      </div>
      
      <div>
        <ErrorAlert error={error} />
        <TableForm
          formData={formData}
          handleNameChange={handleNameChange}
          handleCapacityChange={handleCapacityChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default AddTable;
