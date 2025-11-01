import React, { useState, useEffect } from 'react';
import { Calculator, Settings, Clock, Users, Target, AlertTriangle } from 'lucide-react';

const AllocationCalculator = ({ onDataChange, initialData = {} }) => {
  const [formData, setFormData] = useState({
    priorityLevel: initialData.priorityLevel || 'Medium',
    waterAllocationMethod: initialData.waterAllocationMethod || 'Proportional',
    minimumEnvironmentalFlow: initialData.minimumEnvironmentalFlow || 10000,
    calculationPeriod: initialData.calculationPeriod || 30,
    // Genetic Algorithm Parameters
    populationSize: initialData.populationSize || 100,
    maxGenerations: initialData.maxGenerations || 200,
    crossoverRate: initialData.crossoverRate || 0.8,
    mutationRate: initialData.mutationRate || 0.1,
    // Constraint Weights (sum should be 100% for optimal results)
    equityWeight: initialData.equityWeight || 35,
    sustainabilityWeight: initialData.sustainabilityWeight || 35,
    demandFulfillmentWeight: initialData.demandFulfillmentWeight || 30
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    if (value === '' || value < 0) {
      newErrors[name] = `${name.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a positive number`;
    } else if (name === 'calculationPeriod' && value > 365) {
      newErrors[name] = 'Calculation period cannot exceed 365 days';
    } else if (name === 'populationSize' && value < 20) {
      newErrors[name] = 'Population size must be at least 20';
    } else if (name === 'maxGenerations' && value < 10) {
      newErrors[name] = 'Maximum generations must be at least 10';
    } else if ((name === 'crossoverRate' || name === 'mutationRate') && (value < 0 || value > 1)) {
      newErrors[name] = 'Rate must be between 0 and 1';
    } else if ((name === 'equityWeight' || name === 'sustainabilityWeight' || name === 'demandFulfillmentWeight') && (value < 0 || value > 100)) {
      newErrors[name] = 'Weight must be between 0 and 100';
    } else {
      delete newErrors[name];
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = name === 'priorityLevel' || name === 'waterAllocationMethod' 
      ? value 
      : parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (name !== 'priorityLevel' && name !== 'waterAllocationMethod') {
      validateField(name, numValue);
    }
  };

  const isFormValid = Object.keys(errors).length === 0 && 
    formData.minimumEnvironmentalFlow >= 0 && 
    formData.calculationPeriod > 0 && 
    formData.calculationPeriod <= 365;

  const getPriorityMultiplier = (level) => {
    switch (level) {
      case 'High': return 1.2;
      case 'Medium': return 1.0;
      case 'Low': return 0.8;
      default: return 1.0;
    }
  };

  const priorityMultiplier = getPriorityMultiplier(formData.priorityLevel);

  return (
    <div className="card">
      <h2>
        <Calculator className="inline-block w-6 h-6 mr-2" />
        Calculation Parameters
      </h2>
      
      <div className="form-group">
        <label htmlFor="priorityLevel">
          Priority Level
        </label>
        <select
          id="priorityLevel"
          name="priorityLevel"
          value={formData.priorityLevel}
          onChange={handleInputChange}
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <div className="text-sm text-gray-600 mt-1">
          Multiplier: {priorityMultiplier}x
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="waterAllocationMethod">
          <Settings className="inline-block w-4 h-4 mr-1" />
          Water Allocation Method
        </label>
        <select
          id="waterAllocationMethod"
          name="waterAllocationMethod"
          value={formData.waterAllocationMethod}
          onChange={handleInputChange}
        >
          <option value="Proportional">Proportional (by area)</option>
          <option value="Equal Priority">Equal Priority (per farm)</option>
        </select>
        <div className="text-sm text-gray-600 mt-1">
          {formData.waterAllocationMethod === 'Proportional' 
            ? 'Allocation based on crop area percentage'
            : 'Equal allocation per farm regardless of area'
          }
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="minimumEnvironmentalFlow">
          Minimum Environmental Flow (m³/day)
        </label>
        <input
          type="number"
          id="minimumEnvironmentalFlow"
          name="minimumEnvironmentalFlow"
          value={formData.minimumEnvironmentalFlow}
          onChange={handleInputChange}
          min="0"
          step="1000"
        />
        {errors.minimumEnvironmentalFlow && (
          <div className="error-message">{errors.minimumEnvironmentalFlow}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Reserved for environmental needs
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="calculationPeriod">
          <Clock className="inline-block w-4 h-4 mr-1" />
          Calculation Period (days)
        </label>
        <input
          type="number"
          id="calculationPeriod"
          name="calculationPeriod"
          value={formData.calculationPeriod}
          onChange={handleInputChange}
          min="1"
          max="365"
          step="1"
        />
        {errors.calculationPeriod && (
          <div className="error-message">{errors.calculationPeriod}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Period for water allocation calculations
        </div>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <Target className="w-5 h-5 mr-2" />
          Genetic Algorithm Parameters
        </h3>
      </div>

      <div className="form-group">
        <label htmlFor="populationSize">
          <Users className="inline-block w-4 h-4 mr-1" />
          Population Size
        </label>
        <input
          type="number"
          id="populationSize"
          name="populationSize"
          value={formData.populationSize}
          onChange={handleInputChange}
          min="20"
          step="10"
        />
        {errors.populationSize && (
          <div className="error-message">{errors.populationSize}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Number of candidate solutions per generation (recommended: 50-200)
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="maxGenerations">
          Maximum Generations
        </label>
        <input
          type="number"
          id="maxGenerations"
          name="maxGenerations"
          value={formData.maxGenerations}
          onChange={handleInputChange}
          min="10"
          step="10"
        />
        {errors.maxGenerations && (
          <div className="error-message">{errors.maxGenerations}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Maximum iterations for GA optimization (recommended: 100-500)
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="crossoverRate">
          Crossover Rate
        </label>
        <input
          type="number"
          id="crossoverRate"
          name="crossoverRate"
          value={formData.crossoverRate}
          onChange={handleInputChange}
          min="0"
          max="1"
          step="0.05"
        />
        {errors.crossoverRate && (
          <div className="error-message">{errors.crossoverRate}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Probability of combining parent solutions (recommended: 0.6-0.9)
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="mutationRate">
          Mutation Rate
        </label>
        <input
          type="number"
          id="mutationRate"
          name="mutationRate"
          value={formData.mutationRate}
          onChange={handleInputChange}
          min="0"
          max="1"
          step="0.01"
        />
        {errors.mutationRate && (
          <div className="error-message">{errors.mutationRate}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Probability of random solution changes (recommended: 0.01-0.2)
        </div>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Constraint Weights (Objective: Maximize Crop Production)
        </h3>
      </div>

      <div className="form-group">
        <label htmlFor="equityWeight">
          Equity Weight (%)
        </label>
        <input
          type="number"
          id="equityWeight"
          name="equityWeight"
          value={formData.equityWeight}
          onChange={handleInputChange}
          min="0"
          max="100"
          step="5"
        />
        {errors.equityWeight && (
          <div className="error-message">{errors.equityWeight}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Fair distribution of water resources across all farms
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="sustainabilityWeight">
          Sustainability Weight (%)
        </label>
        <input
          type="number"
          id="sustainabilityWeight"
          name="sustainabilityWeight"
          value={formData.sustainabilityWeight}
          onChange={handleInputChange}
          min="0"
          max="100"
          step="5"
        />
        {errors.sustainabilityWeight && (
          <div className="error-message">{errors.sustainabilityWeight}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Long-term resource preservation and environmental flow
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="demandFulfillmentWeight">
          Demand Fulfillment Weight (%)
        </label>
        <input
          type="number"
          id="demandFulfillmentWeight"
          name="demandFulfillmentWeight"
          value={formData.demandFulfillmentWeight}
          onChange={handleInputChange}
          min="0"
          max="100"
          step="5"
        />
        {errors.demandFulfillmentWeight && (
          <div className="error-message">{errors.demandFulfillmentWeight}</div>
        )}
        <div className="text-sm text-gray-600 mt-1">
          Meeting crop water requirements for maximum production
        </div>
      </div>

      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>Total Weight:</strong> {formData.equityWeight + formData.sustainabilityWeight + formData.demandFulfillmentWeight}%
          {formData.equityWeight + formData.sustainabilityWeight + formData.demandFulfillmentWeight !== 100 && (
            <span className="ml-2 text-orange-600 font-semibold">
              (Adjust weights to total 100% for balanced optimization)
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="text-sm text-gray-700">
          <strong>Calculation Settings:</strong>
          <div className="mt-1">
            Priority Level: <span className="font-semibold">{formData.priorityLevel}</span>
          </div>
          <div>
            Allocation Method: <span className="font-semibold">{formData.waterAllocationMethod}</span>
          </div>
          <div>
            Environmental Reserve: <span className="font-semibold">{formData.minimumEnvironmentalFlow.toLocaleString()} m³/day</span>
          </div>
          <div>
            Period: <span className="font-semibold">{formData.calculationPeriod} days</span>
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

export default AllocationCalculator;






