import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const DataCharts = ({ waterData, farmData, allocationParams, calculatedResults }) => {
  if (!calculatedResults) {
    return (
      <div className="chart-container">
        <h3>Data Visualization</h3>
        <div className="alert alert-warning">
          Please fill in all required data to see charts.
        </div>
      </div>
    );
  }

  const { distributionPerCrop, totalWaterAvailable, agriculturalWaterDemand, environmentalFlow } = calculatedResults;

  // Water Balance Pie Chart Data
  const waterBalanceData = [
    { name: 'Agricultural Use', value: agriculturalWaterDemand, color: '#0ea5e9' },
    { name: 'Environmental Flow', value: environmentalFlow, color: '#10b981' },
    { name: 'Available Reserve', value: Math.max(0, totalWaterAvailable - agriculturalWaterDemand - environmentalFlow), color: '#6b7280' }
  ];

  // Allocation Distribution Bar Chart Data
  const allocationData = Object.entries(distributionPerCrop).map(([crop, data]) => ({
    crop: crop.charAt(0).toUpperCase() + crop.slice(1),
    allocation: data.allocation,
    area: data.area,
    percentage: data.percentage
  }));

  // Historical Trend Data (mock data for demonstration)
  const historicalData = [
    { month: 'Jan', waterLevel: 45, demand: 80, allocation: 75 },
    { month: 'Feb', waterLevel: 52, demand: 85, allocation: 80 },
    { month: 'Mar', waterLevel: 58, demand: 90, allocation: 85 },
    { month: 'Apr', waterLevel: 62, demand: 95, allocation: 90 },
    { month: 'May', waterLevel: 60, demand: 100, allocation: 95 },
    { month: 'Jun', waterLevel: 55, demand: 95, allocation: 90 },
    { month: 'Jul', waterLevel: 50, demand: 90, allocation: 85 },
    { month: 'Aug', waterLevel: 48, demand: 85, allocation: 80 },
    { month: 'Sep', waterLevel: 45, demand: 80, allocation: 75 },
    { month: 'Oct', waterLevel: 42, demand: 75, allocation: 70 },
    { month: 'Nov', waterLevel: 40, demand: 70, allocation: 65 },
    { month: 'Dec', waterLevel: 38, demand: 65, allocation: 60 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()} m³/day
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Water Balance Pie Chart */}
      <div className="chart-container">
        <h3>Water Balance Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={waterBalanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {waterBalanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value.toLocaleString(), 'm³/day']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation Distribution Bar Chart */}
      <div className="chart-container">
        <h3>Water Allocation by Crop Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={allocationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="allocation" fill="#0ea5e9" name="Water Allocation (m³/day)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Trend Line Chart */}
      <div className="chart-container lg:col-span-2">
        <h3>Historical Water Management Trends</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="waterLevel" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              name="Water Level (%)"
            />
            <Line 
              type="monotone" 
              dataKey="demand" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Water Demand (%)"
            />
            <Line 
              type="monotone" 
              dataKey="allocation" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Water Allocation (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Area vs Allocation Scatter Plot */}
      <div className="chart-container lg:col-span-2">
        <h3>Agricultural Area vs Water Allocation</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={allocationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="crop" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="area" 
              fill="#f59e0b" 
              name="Area (hectares)"
            />
            <Bar 
              yAxisId="right"
              dataKey="allocation" 
              fill="#0ea5e9" 
              name="Allocation (m³/day)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DataCharts;

