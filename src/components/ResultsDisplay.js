import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const ResultsDisplay = ({ 
  waterData, 
  farmData, 
  allocationData, 
  calculatedResults 
}) => {
  if (!calculatedResults) {
    return (
      <div className="card">
        <h2>
          <BarChart3 className="inline-block w-6 h-6 mr-2" />
          Calculation Results
        </h2>
        <div className="alert alert-warning">
          Please fill in all required data to see calculation results.
        </div>
      </div>
    );
  }

  const {
    totalWaterAvailable,
    agriculturalWaterDemand,
    recommendedAllocation,
    distributionPerCrop,
    waterDeficitSurplus,
    waterDeficitSurplusPercentage,
    environmentalFlow,
    allocationPerFarm,
    efficiencyMetrics
  } = calculatedResults;

  const getDeficitSurplusColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < -10) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getDeficitSurplusIcon = (value) => {
    if (value > 0) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (value < -10) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <div className="card">
      <h2>
        <BarChart3 className="inline-block w-6 h-6 mr-2" />
        Water Allocation Results
      </h2>
      
      <div className="results-grid">
        <div className="result-item">
          <h4>Total Water Available</h4>
          <div className="value">
            {totalWaterAvailable.toLocaleString()}
            <span className="unit">m³/day</span>
          </div>
        </div>

        <div className="result-item">
          <h4>Agricultural Demand</h4>
          <div className="value">
            {agriculturalWaterDemand.toLocaleString()}
            <span className="unit">m³/day</span>
          </div>
        </div>

        <div className="result-item">
          <h4>Recommended Allocation</h4>
          <div className="value">
            {recommendedAllocation.toLocaleString()}
            <span className="unit">m³/day</span>
          </div>
        </div>

        <div className="result-item">
          <h4>Environmental Flow</h4>
          <div className="value">
            {environmentalFlow.toLocaleString()}
            <span className="unit">m³/day</span>
          </div>
        </div>

        <div className="result-item">
          <h4>Allocation per Farm</h4>
          <div className="value">
            {allocationPerFarm.toFixed(1)}
            <span className="unit">m³/day</span>
          </div>
        </div>

        <div className="result-item">
          <h4>Water Balance</h4>
          <div className={`value ${getDeficitSurplusColor(waterDeficitSurplusPercentage)}`}>
            {getDeficitSurplusIcon(waterDeficitSurplusPercentage)}
            {waterDeficitSurplus > 0 ? '+' : ''}{waterDeficitSurplus.toLocaleString()}
            <span className="unit">m³/day</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ({waterDeficitSurplusPercentage > 0 ? '+' : ''}{waterDeficitSurplusPercentage.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Distribution by Crop Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(distributionPerCrop).map(([crop, data], index) => (
            <div key={crop} className={`p-4 rounded-lg ${index === 0 ? 'bg-light-green' : index === 1 ? 'bg-light-yellow' : 'bg-gray-50'}`}>
              <h4 className="font-semibold text-gray-800 capitalize">{crop}</h4>
              <div className="mt-2">
                <div className={`text-2xl font-bold ${index === 0 ? 'text-light-green' : index === 1 ? 'text-light-yellow' : 'text-gray-600'}`}>
                  {data.allocation.toLocaleString()}
                  <span className="text-sm text-gray-600 ml-1">m³/day</span>
                </div>
                <div className="text-sm text-gray-600">
                  {data.percentage.toFixed(1)}% of total allocation
                </div>
                <div className="text-sm text-gray-600">
                  {data.area} hectares
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Efficiency Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-light-green p-4 rounded-lg">
            <h4 className="font-semibold text-light-green">Storage Utilization</h4>
            <div className="text-2xl font-bold text-light-green">
              {efficiencyMetrics.storageUtilization.toFixed(1)}%
            </div>
            <div className="text-sm text-light-green">
              Current storage vs. capacity
            </div>
          </div>
          
          <div className="bg-light-yellow p-4 rounded-lg">
            <h4 className="font-semibold text-light-yellow">Allocation Efficiency</h4>
            <div className="text-2xl font-bold text-light-yellow">
              {efficiencyMetrics.allocationEfficiency.toFixed(1)}%
            </div>
            <div className="text-sm text-light-yellow">
              Water allocated vs. available
            </div>
          </div>
        </div>
      </div>

      {waterDeficitSurplus < 0 && (
        <div className="mt-6 alert alert-danger">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <strong>Water Deficit Warning:</strong> The calculated demand exceeds available water by {Math.abs(waterDeficitSurplus).toLocaleString()} m³/day. 
          Consider reducing allocation or increasing water supply.
        </div>
      )}

      {waterDeficitSurplus > 0 && waterDeficitSurplusPercentage > 20 && (
        <div className="mt-6 alert alert-success">
          <CheckCircle className="w-5 h-5 mr-2" />
          <strong>Water Surplus:</strong> There is sufficient water available with a surplus of {waterDeficitSurplus.toLocaleString()} m³/day. 
          Consider increasing allocation or storing excess water.
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;




