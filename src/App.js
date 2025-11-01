import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import LandingPage from './components/WelcomeScreen';
import MainInputPage from './components/MainInputPage';
import ResultsPage from './components/ResultsPage';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/input" component={MainInputPage} />
        <Route path="/results" component={ResultsPage} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
