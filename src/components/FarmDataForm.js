import React, { useState, useEffect } from 'react';
import { Crop, MapPin, Droplets } from 'lucide-react';

const FarmDataForm = ({ onDataChange, initialData = {} }) => {
  const [formData, setFormData] = useState({
    numberOfFarms: initialData.numberOfFarms || 150,
    totalAgriculturalArea: initialData.totalAgriculturalArea || 2500,
    riceArea: initialData.riceArea || 2500,
    riceType: initialData.riceType || 'Inbred',
    currentSoilMoisture: initialData.currentSoilMoisture || 65,
    irrigationEfficiency: initialData.irrigationEfficiency || 75
  });

  const [errors, setErrors] = useState({});

  // Rice water requirements based on type (in m³/day per hectare)
  const riceWaterRequirements = {
    'Inbred': 8.5,
    'Hybrid': 10.0
  };

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (value === '' || value < 0) {
      newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a positive number`;
    } else if (name === 'currentSoilMoisture' && value > 100) {
      newErrors[name] = 'Soil moisture cannot exceed 100%';
    } else if (name === 'irrigationEfficiency' && value > 100) {
      newErrors[name] = 'Irrigation efficiency cannot exceed 100%';
    } else if (name === 'riceArea' && value > formData.totalAgriculturalArea) {
      newErrors[name] = 'Rice area cannot exceed total agricultural area';
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = /^[0-9.]+$/.test(value) ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (/^[0-9.]+$/.test(value)) {
      validateField(name, numValue);
    }
  };

  const remainingArea = formData.totalAgriculturalArea - formData.riceArea;

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.numberOfFarms > 0 && 
    formData.totalAgriculturalArea > 0 && 
    formData.riceArea >= 0 &&
    formData.riceArea <= formData.totalAgriculturalArea &&
    formData.currentSoilMoisture >= 0 && 
    formData.currentSoilMoisture <= 100 &&
    formData.irrigationEfficiency >= 0 && 
    formData.irrigationEfficiency <= 100;

  return (
    <div className="card">
      <h2>
        <Crop className="inline-block w-6 h-6 mr-2" />
        Cuyapo Agricultural Data
      </h2>
      
      <div className="form-group">
        <label htmlFor="numberOfFarms">
          Number of Farms *
        </label>
        <input
          type="number"
          id="numberOfFarms"
          name="numberOfFarms"
          value={formData.numberOfFarms}
          onChange={handleInputChange}
          min="1"
          step="1"
          required
        />
        {errors.numberOfFarms && (
          <div className="error-message">{errors.numberOfFarms}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="totalAgriculturalArea">
          <MapPin className="inline-block w-4 h-4 mr-1" />
          Total Agricultural Area (hectares) *
        </label>
        <input
          type="number"
          id="totalAgriculturalArea"
          name="totalAgriculturalArea"
          value={formData.totalAgriculturalArea}
          onChange={handleInputChange}
          min="0"
          step="0.1"
          required
        />
        {errors.totalAgriculturalArea && (
          <div className="error-message">{errors.totalAgriculturalArea}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="riceType">
          Rice Crop Type
        </label>
        <select
          id="riceType"
          name="riceType"
          value={formData.riceType}
          onChange={handleInputChange}
        >
          <option value="Inbred">Inbred Rice</option>
          <option value="Hybrid">Hybrid Rice</option>
        </select>
        <div className="text-sm text-gray-600 mt-1">
          Water requirement: {riceWaterRequirements[formData.riceType]} m³/day per hectare
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="riceArea">
          Rice Area (hectares)
        </label>
        <input
          type="number"
          id="riceArea"
          name="riceArea"
          value={formData.riceArea}
          onChange={handleInputChange}
          min="0"
          step="0.1"
        />
        {errors.riceArea && (
          <div className="error-message">{errors.riceArea}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="currentSoilMoisture">
          <Droplets className="inline-block w-4 h-4 mr-1" />
          Current Soil Moisture (%)
        </label>
        <input
          type="number"
          id="currentSoilMoisture"
          name="currentSoilMoisture"
          value={formData.currentSoilMoisture}
          onChange={handleInputChange}
          min="0"
          max="100"
          step="0.1"
        />
        {errors.currentSoilMoisture && (
          <div className="error-message">{errors.currentSoilMoisture}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="irrigationEfficiency">
          Irrigation Efficiency (%)
        </label>
        <input
          type="number"
          id="irrigationEfficiency"
          name="irrigationEfficiency"
          value={formData.irrigationEfficiency}
          onChange={handleInputChange}
          min="0"
          max="100"
          step="0.1"
        />
        {errors.irrigationEfficiency && (
          <div className="error-message">{errors.irrigationEfficiency}</div>
        )}
      </div>

      <div className="mt-4 p-3 bg-light-yellow rounded-lg">
        <div className="text-sm text-gray-700">
          <strong>Area Summary:</strong>
          <div className="mt-1">
            Rice Area: {formData.riceArea.toFixed(1)} hectares
          </div>
          <div className="text-light-yellow">
            Remaining Area: {remainingArea.toFixed(1)} hectares
          </div>
        </div>
      </div>

      {!isFormValid && (
        <div className="alert alert-warning">
          Please fill in all required fields with valid values.
        </div>
      )}
    </div>
  );
};

export default FarmDataForm;
