import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Download } from 'lucide-react';

const ResultsPage = () => {
  const history = useHistory();
  const location = useLocation();
  
  // Get data from navigation state
  const { results, inputData } = location.state || {};

  if (!results) {
    return (
      <div className="results-container">
        <div className="results-content">
          <div className="alert alert-error">
            No results data available. Please go back and generate optimization.
          </div>
          <button className="btn btn-secondary" onClick={() => history.push('/input')}>
            <ArrowLeft className="btn-icon" />
            Back to Input
          </button>
        </div>
      </div>
    );
  }

  const chartData = results.allocations.map(allocation => ({
    name: `Farm ${allocation.farm_id}`,
    'Water Allocated': allocation.water_allocated.toFixed(2),
    'Water Demand': allocation.farm_size * (inputData.crop_water_reqs[allocation.farm_id - 1] || 0)
  }));

  const handleExport = () => {
    const dataStr = JSON.stringify({
      input: inputData,
      results: results,
      timestamp: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `water-allocation-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-container">
      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">Optimization Results</h1>
          <button className="btn btn-secondary btn-export" onClick={handleExport}>
            <Download className="btn-icon" />
            Export Results
          </button>
        </div>

        <div className="results-summary">
          <h2 className="summary-title">Input Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Water Supply:</span>
              <span className="summary-value">{inputData.total_water_supply.toLocaleString()} m³</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Number of Farms:</span>
              <span className="summary-value">{inputData.num_farms}</span>
            </div>
          </div>
        </div>

        <div className="metrics-section">
          <h2 className="section-title">Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3 className="metric-label">Total Water Shortage</h3>
              <p className="metric-value">{results.metrics.total_shortage.toFixed(2)} m³</p>
            </div>
            <div className="metric-card">
              <h3 className="metric-label">Jain's Fairness Index</h3>
              <p className="metric-value">{results.metrics.fairness_index.toFixed(2)}</p>
            </div>
            <div className="metric-card">
              <h3 className="metric-label">Water Efficiency</h3>
              <p className="metric-value">{(results.metrics.water_efficiency * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="allocation-section">
          <h2 className="section-title">Optimized Water Allocation</h2>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Farm ID</th>
                  <th>Farm Size (Ha)</th>
                  <th>Water Allocated (m³)</th>
                  <th>Water Shortage (m³)</th>
                </tr>
              </thead>
              <tbody>
                {results.allocations.map((allocation, idx) => (
                  <tr key={idx}>
                    <td>{allocation.farm_id}</td>
                    <td>{allocation.farm_size.toFixed(2)}</td>
                    <td>{allocation.water_allocated.toFixed(2)}</td>
                    <td className={allocation.shortage > 0 ? 'negative' : 'positive'}>
                      {allocation.shortage.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-section">
          <h2 className="section-title">Allocation Visualization</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Water (m³)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Water Allocated" fill="#3B82F6" />
                <Bar dataKey="Water Demand" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => history.push('/input')}>
            <ArrowLeft className="btn-icon" />
            Back to Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

