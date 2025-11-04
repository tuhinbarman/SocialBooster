import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const Report = () => {
  const [stateData, setStateData] = useState(null);
  const [selectedState, setSelectedState] = useState("Maharashtra");

  useEffect(() => {
    fetch("http://localhost:8000/covid-data/")
      .then((res) => res.json())
      .then((data) => {
        const allStates = data.data?.regional_data || [];
        const match = allStates.find((s) => s.loc === selectedState);
        setStateData(match);
      });
  }, [selectedState]);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

  const chartData = stateData
    ? [
        { name: "Confirmed", value: stateData.totalConfirmed },
        { name: "Recovered", value: stateData.discharged },
        { name: "Deaths", value: stateData.deaths },
      ]
    : [];

  return (
    <div className="page">
      <h3>COVID Report</h3>
      <select onChange={(e) => setSelectedState(e.target.value)}>
        <option>Maharashtra</option>
        <option>Karnataka</option>
        <option>Kerala</option>
        <option>Delhi</option>
        <option>Tamil Nadu</option>
      </select>

      {stateData ? (
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Report;
