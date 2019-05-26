import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Main from './components/Main/Main';
import CorrectionMode from './components/CorrectionMode/CorrectionMode';
import PocketMode from './components/PocketMode/PocketMode';
import AddTool from './components/AddTool/AddTool';

function App() {
  return (
    <div className="App">
      {
        <Router>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/correctionmode" exact component={CorrectionMode} />
            <Route path="/pocketmode" exact component={PocketMode} />
            <Route path="/addtool" exact component={AddTool} />
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;