import React, { useState, useEffect, useCallback } from 'react';
import WaterInputForm from './components/WaterInputForm';
import FarmDataForm from './components/FarmDataForm';
import AllocationCalculator from './components/AllocationCalculator';
import ResultsDisplay from './components/ResultsDisplay';
import WelcomeScreen from './components/WelcomeScreen';

// Mock data for initialization
const mockData = {
  waterData: {
    totalStorageCapacity: 3000,
    currentStorageVolume: 1800,
    dailyInflowRate: 50000,
    rainfallInWatershed: 15
  },
  farmData: {
    numberOfFarms: 150,
    totalAgriculturalArea: 2500,
    riceArea: 2500,
    riceType: 'Inbred',
    currentSoilMoisture: 65,
    irrigationEfficiency: 75
  },
  allocationData: {
    priorityLevel: 'Medium',
    waterAllocationMethod: 'Proportional',
    minimumEnvironmentalFlow: 10000,
    calculationPeriod: 30,
    populationSize: 100,
    maxGenerations: 200,
    crossoverRate: 0.8,
    mutationRate: 0.1,
    equityWeight: 35,
    sustainabilityWeight: 35,
    demandFulfillmentWeight: 30
  }
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [waterData, setWaterData] = useState(mockData.waterData);
  const [farmData, setFarmData] = useState(mockData.farmData);
  const [allocationData, setAllocationData] = useState(mockData.allocationData);
  const [calculatedResults, setCalculatedResults] = useState(null);

  // Water allocation calculation logic
  const calculateWaterAllocation = useCallback(() => {
    try {
      // Validate required data
      if (!waterData || !farmData || !allocationData) {
        return null;
      }

      const {
        totalStorageCapacity,
        currentStorageVolume,
        dailyInflowRate,
        rainfallInWatershed
      } = waterData;

      const {
        numberOfFarms,
        totalAgriculturalArea,
        riceArea,
        riceType,
        currentSoilMoisture,
        irrigationEfficiency
      } = farmData;

      const {
        priorityLevel,
        waterAllocationMethod,
        minimumEnvironmentalFlow,
        calculationPeriod
      } = allocationData;

      // Calculate total water available
      const storageWater = currentStorageVolume * 1000000; // Convert to m³
      const inflowWater = dailyInflowRate * calculationPeriod;
      const rainfallContribution = rainfallInWatershed * totalAgriculturalArea * 10; // mm to m³ conversion
      const totalWaterAvailable = (storageWater + inflowWater + rainfallContribution) / calculationPeriod;

      // Rice water requirements based on type (m³/day per hectare)
      const riceWaterRequirements = {
        'Inbred': 8.5,
        'Hybrid': 10.0
      };
      
      // Calculate base water demand for rice only
      let agriculturalWaterDemand = 0;
      if (riceArea > 0) {
        const waterReq = riceWaterRequirements[riceType] || 8.5;
        const baseDemand = riceArea * waterReq;
        // Adjust for soil moisture and irrigation efficiency
        const soilMoistureFactor = Math.max(0.5, 1 - (currentSoilMoisture / 100));
        const efficiencyFactor = irrigationEfficiency / 100;
        agriculturalWaterDemand = baseDemand * soilMoistureFactor / efficiencyFactor;
      }

      // Apply priority multiplier
      const priorityMultipliers = { High: 1.2, Medium: 1.0, Low: 0.8 };
      const priorityMultiplier = priorityMultipliers[priorityLevel] || 1.0;
      agriculturalWaterDemand *= priorityMultiplier;

      // Calculate allocation method
      let recommendedAllocation;
      let distributionPerCrop = {};

      if (waterAllocationMethod === 'Proportional') {
        // Proportional allocation based on area
        recommendedAllocation = Math.min(agriculturalWaterDemand, totalWaterAvailable - minimumEnvironmentalFlow);
        
        distributionPerCrop.rice = {
          allocation: recommendedAllocation,
          area: riceArea,
          percentage: 100
        };
      } else {
        // Equal priority allocation per farm
        const allocationPerFarm = Math.min(agriculturalWaterDemand, totalWaterAvailable - minimumEnvironmentalFlow) / numberOfFarms;
        recommendedAllocation = allocationPerFarm * numberOfFarms;
        
        distributionPerCrop.rice = {
          allocation: recommendedAllocation,
          area: riceArea,
          percentage: 100
        };
      }

      // Calculate water balance
      const environmentalFlow = minimumEnvironmentalFlow;
      const waterDeficitSurplus = totalWaterAvailable - recommendedAllocation - environmentalFlow;
      const waterDeficitSurplusPercentage = (waterDeficitSurplus / totalWaterAvailable) * 100;

      // Calculate efficiency metrics
      const storageUtilization = (currentStorageVolume / totalStorageCapacity) * 100;
      const allocationEfficiency = (recommendedAllocation / totalWaterAvailable) * 100;

      // Calculate allocation per farm
      const allocationPerFarm = recommendedAllocation / numberOfFarms;

      return {
        totalWaterAvailable,
        agriculturalWaterDemand,
        recommendedAllocation,
        distributionPerCrop,
        waterDeficitSurplus,
        waterDeficitSurplusPercentage,
        environmentalFlow,
        allocationPerFarm,
        efficiencyMetrics: {
          storageUtilization,
          allocationEfficiency
        }
      };
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }, [waterData, farmData, allocationData]);

  // Update calculations when data changes
  useEffect(() => {
    const results = calculateWaterAllocation();
    setCalculatedResults(results);
  }, [calculateWaterAllocation]);

  const handleStart = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>AgriRise: Optimization of Irrigation Water Allocation in Cuyapo, Nueva Ecija Using NSGA-II Genetic Algorithm</h1>
      </header>

      <div className="grid">
        <WaterInputForm 
          onDataChange={setWaterData}
          initialData={waterData}
        />
        <FarmDataForm 
          onDataChange={setFarmData}
          initialData={farmData}
        />
        <AllocationCalculator 
          onDataChange={setAllocationData}
          initialData={allocationData}
        />
      </div>

      <ResultsDisplay 
        waterData={waterData}
        farmData={farmData}
        allocationData={allocationData}
        calculatedResults={calculatedResults}
      />
    </div>
  );
}

export default App;

