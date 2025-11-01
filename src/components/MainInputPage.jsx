import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Send, Plus, Minus } from 'lucide-react';

const MainInputPage = () => {
  const history = useHistory();
  const [numFarms, setNumFarms] = useState(3);
  const [totalWaterSupply, setTotalWaterSupply] = useState('');
  const [farms, setFarms] = useState([
    { farm_size: '', crop_water_req: '', canal_capacity: '' },
    { farm_size: '', crop_water_req: '', canal_capacity: '' },
    { farm_size: '', crop_water_req: '', canal_capacity: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNumFarmsChange = (e) => {
    const newNumFarms = parseInt(e.target.value) || 0;
    setNumFarms(newNumFarms);
    
    if (newNumFarms > farms.length) {
      // Add new farm slots
      const newFarms = [...farms];
      while (newFarms.length < newNumFarms) {
        newFarms.push({ farm_size: '', crop_water_req: '', canal_capacity: '' });
      }
      setFarms(newFarms);
    } else if (newNumFarms < farms.length) {
      // Remove farm slots
      setFarms(farms.slice(0, newNumFarms));
    }
  };

  const handleFarmChange = (index, field, value) => {
    const newFarms = [...farms];
    newFarms[index][field] = value;
    setFarms(newFarms);
  };

  const validateForm = () => {
    if (!totalWaterSupply || parseFloat(totalWaterSupply) <= 0) {
      setError('Please enter a valid total water supply');
      return false;
    }

    for (let i = 0; i < farms.length; i++) {
      if (!farms[i].farm_size || parseFloat(farms[i].farm_size) <= 0) {
        setError(`Please enter a valid farm size for Farm ${i + 1}`);
        return false;
      }
      if (!farms[i].crop_water_req || parseFloat(farms[i].crop_water_req) <= 0) {
        setError(`Please enter a valid crop water requirement for Farm ${i + 1}`);
        return false;
      }
      if (!farms[i].canal_capacity || parseFloat(farms[i].canal_capacity) <= 0) {
        setError(`Please enter a valid canal capacity for Farm ${i + 1}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        total_water_supply: parseFloat(totalWaterSupply),
        num_farms: numFarms,
        farm_sizes: farms.map(f => parseFloat(f.farm_size)),
        crop_water_reqs: farms.map(f => parseFloat(f.crop_water_req)),
        canal_capacities: farms.map(f => parseFloat(f.canal_capacity))
      };

      // Try to call the backend API
      try {
        const response = await axios.post('http://localhost:5000/api/optimize', payload);
        const results = response.data;

        history.push({
          pathname: '/results',
          state: { 
            results: results,
            inputData: payload
          }
        });
      } catch (apiError) {
        console.error('API Error:', apiError);
        setError('Backend not available. Using mock data for demonstration.');
        
        // Fallback to mock data if backend is not running
        const mockResults = {
          allocations: farms.map((farm, idx) => ({
            farm_id: idx + 1,
            farm_size: parseFloat(farm.farm_size),
            water_allocated: parseFloat(totalWaterSupply) / numFarms,
            shortage: parseFloat(farm.crop_water_req) * parseFloat(farm.farm_size) - (parseFloat(totalWaterSupply) / numFarms)
          })),
          metrics: {
            total_shortage: 5000,
            fairness_index: 0.85,
            water_efficiency: 0.78
          }
        };

        history.push({
          pathname: '/results',
          state: { 
            results: mockResults,
            inputData: payload
          }
        });
      }
    } catch (err) {
      setError('Failed to optimize water allocation. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="main-content">
        <h1 className="main-title">Optimize Water Allocation</h1>
        <p className="main-subtitle">Enter your irrigation parameters to generate optimal allocation</p>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-section">
            <h2 className="section-title">System Parameters</h2>
            
            <div className="form-group">
              <label htmlFor="total_water_supply" className="form-label">
                Total Available Water Supply (m³)
              </label>
              <input
                type="number"
                id="total_water_supply"
                className="form-input"
                value={totalWaterSupply}
                onChange={(e) => setTotalWaterSupply(e.target.value)}
                required
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="num_farms" className="form-label">
                Number of Farms
              </label>
              <input
                type="number"
                id="num_farms"
                className="form-input"
                value={numFarms}
                onChange={handleNumFarmsChange}
                required
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Farm Parameters</h2>
            <div className="farms-container">
              {farms.map((farm, index) => (
                <div key={index} className="farm-card">
                  <h3 className="farm-title">Farm {index + 1}</h3>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Farm Size (Hectares)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={farm.farm_size}
                      onChange={(e) => handleFarmChange(index, 'farm_size', e.target.value)}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Crop Water Requirement (m³/Hectare)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={farm.crop_water_req}
                      onChange={(e) => handleFarmChange(index, 'crop_water_req', e.target.value)}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Canal Capacity (m³)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={farm.canal_capacity}
                      onChange={(e) => handleFarmChange(index, 'canal_capacity', e.target.value)}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-submit"
            disabled={loading}
          >
            <Send className="btn-icon" />
            {loading ? 'Optimizing...' : 'Generate Optimal Allocation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MainInputPage;

