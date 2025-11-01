import React from 'react';
import { Sprout, Droplets, Calculator } from 'lucide-react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <Sprout className="welcome-icon" />
          <h1 className="welcome-title">
            AgriRise
          </h1>
          <h2 className="welcome-subtitle">
            Optimization of Irrigation Water Allocation in Cuyapo, Nueva Ecija Using NSGA-II Genetic Algorithm
          </h2>
        </div>

        <div className="welcome-instructions">
          <h3>How to Use This System</h3>
          <div className="instructions-grid">
            <div className="instruction-card">
              <Droplets className="instruction-icon" />
              <h4>Step 1: Enter Water Resource Data</h4>
              <p>Input information about the reservoir including storage capacity, current volume, inflow rates, and rainfall data.</p>
            </div>

            <div className="instruction-card">
              <Sprout className="instruction-icon" />
              <h4>Step 2: Enter Agricultural Data</h4>
              <p>Provide details about farms, rice area and type (Inbred or Hybrid), soil moisture levels, and irrigation efficiency.</p>
            </div>

            <div className="instruction-card">
              <Calculator className="instruction-icon" />
              <h4>Step 3: Set Calculation Parameters</h4>
              <p>Configure priority levels, allocation methods, environmental flow requirements, and calculation period.</p>
            </div>
          </div>

          <div className="welcome-description">
            <p>
              This system uses NSGA-II (Non-dominated Sorting Genetic Algorithm II) to optimize irrigation water allocation 
              efficiently across agricultural areas in Cuyapo, Nueva Ecija. It considers multiple factors including crop water 
              requirements, soil conditions, reservoir capacity, and environmental needs to provide optimal 
              water distribution recommendations while balancing equity, sustainability, and demand fulfillment.
            </p>
          </div>
        </div>

        <button className="btn btn-primary btn-start" onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;

