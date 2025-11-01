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
    riceArea: 1200,
    riceType: 'Inbred',
    cornArea: 800,
    cornType: 'Open Pollinated',
    vegetablesArea: 500,
    vegetablesType: 'Traditional',
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
        cornArea,
        cornType,
        vegetablesArea,
        vegetablesType,
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

      // Crop water requirements based on type (m³/day per hectare)
      const cropWaterRequirements = {
        rice: {
          'Inbred': 8.5,
          'Hybrid': 10.0
        },
        corn: {
          'Open Pollinated': 6.0,
          'Hybrid': 7.5
        },
        vegetables: {
          'Traditional': 4.5,
          'Improved': 5.5
        }
      };

      const cropAreas = { 
        rice: { area: riceArea, type: riceType },
        corn: { area: cornArea, type: cornType },
        vegetables: { area: vegetablesArea, type: vegetablesType }
      };
      
      // Calculate base water demand
      let agriculturalWaterDemand = 0;
      Object.entries(cropAreas).forEach(([crop, data]) => {
        if (data.area > 0) {
          const waterReq = cropWaterRequirements[crop][data.type] || cropWaterRequirements[crop]['Inbred'] || cropWaterRequirements[crop]['Open Pollinated'] || cropWaterRequirements[crop]['Traditional'];
          const baseDemand = data.area * waterReq;
          // Adjust for soil moisture and irrigation efficiency
          const soilMoistureFactor = Math.max(0.5, 1 - (currentSoilMoisture / 100));
          const efficiencyFactor = irrigationEfficiency / 100;
          agriculturalWaterDemand += baseDemand * soilMoistureFactor / efficiencyFactor;
        }
      });

      // Apply priority multiplier
      const priorityMultipliers = { High: 1.2, Medium: 1.0, Low: 0.8 };
      const priorityMultiplier = priorityMultipliers[priorityLevel] || 1.0;
      agriculturalWaterDemand *= priorityMultiplier;

      // Calculate allocation method
      let recommendedAllocation;
      let distributionPerCrop = {};

      if (waterAllocationMethod === 'Proportional') {
        // Proportional allocation based on area
        const totalCropArea = riceArea + cornArea + vegetablesArea;
        recommendedAllocation = Math.min(agriculturalWaterDemand, totalWaterAvailable - minimumEnvironmentalFlow);
        
        Object.entries(cropAreas).forEach(([crop, data]) => {
          if (totalCropArea > 0) {
            const percentage = data.area / totalCropArea;
            distributionPerCrop[crop] = {
              allocation: recommendedAllocation * percentage,
              area: data.area,
              percentage: percentage * 100
            };
          } else {
            distributionPerCrop[crop] = { allocation: 0, area: data.area, percentage: 0 };
          }
        });
      } else {
        // Equal priority allocation per farm
        const allocationPerFarm = Math.min(agriculturalWaterDemand, totalWaterAvailable - minimumEnvironmentalFlow) / numberOfFarms;
        recommendedAllocation = allocationPerFarm * numberOfFarms;
        
        Object.entries(cropAreas).forEach(([crop, data]) => {
          const farmsForCrop = Math.ceil(data.area / (totalAgriculturalArea / numberOfFarms));
          distributionPerCrop[crop] = {
            allocation: allocationPerFarm * farmsForCrop,
            area: data.area,
            percentage: (allocationPerFarm * farmsForCrop / recommendedAllocation) * 100
          };
        });
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

