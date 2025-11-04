import React, { useEffect, useState } from "react";

const CovidData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch COVID data from external API or your backend
    fetch("http://localhost:8000/covid-data")
      .then((res) => res.json())
      .then((data) => setData(data?.regional_data || []))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Function to call POST API when Add button is clicked
  const handleAdd = async (record) => {
    try {
      const response = await fetch("http://localhost:8000/covid-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loc: record.loc,
          totalConfirmed: record.totalConfirmed,
          discharged: record.discharged,
          deaths: record.deaths,
          confirmedCasesForeign : record.confirmedCasesForeign,
          confirmedCasesIndian : record.confirmedCasesIndian
        }),
      });

      if (response.ok) {
        alert(`Data for ${record.loc} added successfully!`);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(`Failed to add data for ${record.loc}`);
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Error occurred while adding data.");
    }
  };

  return (
    <div className="page">
      <h3>COVID Data</h3>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Confirmed</th>
            <th>Recovered</th>
            <th>Deaths</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.loc}</td>
              <td>{row.totalConfirmed}</td>
              <td>{row.discharged}</td>
              <td>{row.deaths}</td>
              <td>
                <button className="add-btn" onClick={() => handleAdd(row)}>
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CovidData;
