import React, { useState } from "react";
import { deleteReservation, listTables, updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function TableDetail({ table }) {
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();
  const [error, setError] = useState(null);

  console.log(currentTable);
  
  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteReservation(currentTable.table_id, abortController.signal);
      console.log(response);
      const tableSet = response.find((table) => table.table_id === currentTable.table_id);
      setCurrentTable({...tableSet});
      listTables();
      return tableSet;
    } catch(error) {
      setError(error);
    }
  }

  async function handleClear(event) {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      await updateReservationStatus({ status: "finished" }, currentTable.reservation_id, abortController.signal);
      const newTable = await clearAndLoadTables();
      console.log(newTable);
      history.push("/tables");
      return;
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row">{currentTable.table_id}</th>
        <td>{currentTable.table_name}</td>
        <td>{currentTable.capacity}</td>
        <td>{currentTable.reservation_id}</td>
        <td data-table-id-status={`${table.table_id}`}>
          {currentTable.tableStatus}
        </td>
        <td>
          {currentTable.reservation_id ?
          <button 
            className="btn btn-danger"
            onClick={handleClear}
            data-table-id-finish={`${table.table_id}`}
          >
            Finish
          </button>
          :
          <></>
          }  
        </td>
      </tr>
    </>
  );
}

export default TableDetail;
