import React, { useEffect, useState } from "react";

const UpdateData = () => {
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});

  // Fetch all existing records from backend
  useEffect(() => {
    fetch("http://localhost:8000/update-covid-data")
      .then((res) => res.json())
      .then((data) => setData(data.data || []))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Start editing mode
  const handleEdit = (record) => {
    setEditingRow(record.loc);
    setEditedRecord({ ...record });
  };

const handleUpdate = async (loc) => {
  try {
    const response = await fetch(`http://localhost:8000/update-covid-data`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedRecord),
    });

    if (response.ok) {
      alert(`Record updated successfully`);
      setEditingRow(null);

      // Refresh table
      const updated = data.map((r) =>
        r.loc === loc ? { ...r, ...editedRecord } : r
      );
      setData(updated);
    } else {
      alert("Failed to update record");
    }
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Error occurred while updating data.");
  }
};

  // Delete record (DELETE API)
  const handleDelete = async (loc) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(`http://localhost:8000/delete-covid-data`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert(`Record deleted successfully`);
        setData(data.filter((r) => r.loc !== loc));
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Error occurred while deleting data.");
    }
  };

  return (
    <div className="page">
      <h3>Update & Delete COVID Data</h3>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Confirmed</th>
            <th>Recovered</th>
            <th>Deaths</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.loc}>
              <td>
                {editingRow === row.loc ? (
                  <input
                    value={editedRecord.loc || ""}
                    onChange={(e) =>
                      setEditedRecord({
                        ...editedRecord,
                        loc: e.target.value,
                      })
                    }
                  />
                ) : (
                  row.loc
                )}
              </td>
              <td>
                {editingRow === row.loc ? (
                  <input
                    value={editedRecord.totalConfirmed || ""}
                    onChange={(e) =>
                      setEditedRecord({
                        ...editedRecord,
                        totalConfirmed: e.target.value,
                      })
                    }
                  />
                ) : (
                  row.totalConfirmed
                )}
              </td>
              <td>
                {editingRow === row.loc ? (
                  <input
                    value={editedRecord.discharged || ""}
                    onChange={(e) =>
                      setEditedRecord({
                        ...editedRecord,
                        discharged: e.target.value,
                      })
                    }
                  />
                ) : (
                  row.discharged
                )}
              </td>
              <td>
                {editingRow === row.loc ? (
                  <input
                    value={editedRecord.deaths || ""}
                    onChange={(e) =>
                      setEditedRecord({
                        ...editedRecord,
                        deaths: e.target.value,
                      })
                    }
                  />
                ) : (
                  row.deaths
                )}
              </td>
              <td>
                {editingRow === row.loc ? (
                  <>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdate(row.loc)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingRow(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(row)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(row.loc)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateData;
