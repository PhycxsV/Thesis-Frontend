import React, { useState, useEffect } from 'react';
import { Droplets, Database, CloudRain, Waves } from 'lucide-react';

const WaterInputForm = ({ onDataChange, initialData = {} }) => {
  const [formData, setFormData] = useState({
    totalStorageCapacity: initialData.totalStorageCapacity || 3000,
    currentStorageVolume: initialData.currentStorageVolume || 1800,
    dailyInflowRate: initialData.dailyInflowRate || 50000,
    rainfallInWatershed: initialData.rainfallInWatershed || 15
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (value === '' || value < 0) {
      newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a positive number`;
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    validateField(name, numValue);
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.totalStorageCapacity > 0 && 
    formData.currentStorageVolume > 0 && 
    formData.dailyInflowRate > 0 && 
    formData.rainfallInWatershed >= 0;

  return (
    <div className="card">
      <h2>
        <Droplets className="inline-block w-6 h-6 mr-2" />
        Water Resource Data
      </h2>
      
      <div className="form-group">
        <label htmlFor="totalStorageCapacity">
          <Database className="inline-block w-4 h-4 mr-1" />
          Total Storage Capacity (MCM)
        </label>
        <input
          type="number"
          id="totalStorageCapacity"
          name="totalStorageCapacity"
          value={formData.totalStorageCapacity}
          onChange={handleInputChange}
          min="0"
          step="0.1"
          required
        />
        {errors.totalStorageCapacity && (
          <div className="error-message">{errors.totalStorageCapacity}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="currentStorageVolume">
          <Waves className="inline-block w-4 h-4 mr-1" />
          Current Storage Volume (MCM)
        </label>
        <input
          type="number"
          id="currentStorageVolume"
          name="currentStorageVolume"
          value={formData.currentStorageVolume}
          onChange={handleInputChange}
          min="0"
          step="0.1"
          required
        />
        {errors.currentStorageVolume && (
          <div className="error-message">{errors.currentStorageVolume}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dailyInflowRate">
          <Waves className="inline-block w-4 h-4 mr-1" />
          Daily Inflow Rate (m³/day)
        </label>
        <input
          type="number"
          id="dailyInflowRate"
          name="dailyInflowRate"
          value={formData.dailyInflowRate}
          onChange={handleInputChange}
          min="0"
          step="1000"
          required
        />
        {errors.dailyInflowRate && (
          <div className="error-message">{errors.dailyInflowRate}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="rainfallInWatershed">
          <CloudRain className="inline-block w-4 h-4 mr-1" />
          Rainfall in Watershed (mm)
        </label>
        <input
          type="number"
          id="rainfallInWatershed"
          name="rainfallInWatershed"
          value={formData.rainfallInWatershed}
          onChange={handleInputChange}
          min="0"
          step="0.1"
        />
        {errors.rainfallInWatershed && (
          <div className="error-message">{errors.rainfallInWatershed}</div>
        )}
      </div>

      <div className="mt-4 p-3 bg-light-green rounded-lg">
        <div className="text-sm text-gray-700">
          <strong>Storage Summary:</strong>
          <div className="mt-1">
            Storage Utilization: {((formData.currentStorageVolume / formData.totalStorageCapacity) * 100).toFixed(1)}%
          </div>
          <div className="text-light-green">
            Available Capacity: {(formData.totalStorageCapacity - formData.currentStorageVolume).toFixed(1)} MCM
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

export default WaterInputForm;
