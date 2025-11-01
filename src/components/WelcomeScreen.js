import React from 'react';
import { useHistory } from 'react-router-dom';
import { Database, Network, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const history = useHistory();

  const handleGetStarted = () => {
    history.push('/input');
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="landing-header">
          <h1 className="landing-title">
            AgriRise: Optimized Irrigation Water Allocation
          </h1>
          <h2 className="landing-subtitle">
            A Decision-Support System for Cuyapo, Nueva Ecija
          </h2>
        </div>

        <div className="how-it-works">
          <h3 className="how-it-works-title">How It Works</h3>
          <div className="steps-grid">
            <div className="step-card">
              <Database className="step-icon" />
              <h4 className="step-number">Step 1: Data Input & Forecasting</h4>
              <p className="step-description">
                Input your farm parameters. The system integrates local data and uses ARIMA for weather forecasting.
              </p>
            </div>

            <div className="step-card">
              <Network className="step-icon" />
              <h4 className="step-number">Step 2: Multi-Objective Optimization</h4>
              <p className="step-description">
                Our NSGA-II algorithm generates schedules that balance efficiency, equity, and sustainability.
              </p>
            </div>

            <div className="step-card">
              <TrendingUp className="step-icon" />
              <h4 className="step-number">Step 3: Decision Support</h4>
              <p className="step-description">
                Receive a clear, actionable water allocation plan to enhance productivity and reduce conflict.
              </p>
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-get-started" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

