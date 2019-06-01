import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Main from './components/Main/Main';
import CorrectionMode from './components/CorrectionMode/CorrectionMode';
import Vocabularium from './components/Vocabularium/Vocabularium';
import PocketMode from './components/PocketMode/PocketMode';
import More from './components/More/More';
import AddTool from './components/AddTool/AddTool';

function App() {
  return (
    <div className="App">
      {
        <Router>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/correctionmode" exact component={CorrectionMode} />
            <Route path="/vocabularium" exact component={Vocabularium} />
            <Route path="/vocabularium/pocketmode" exact component={PocketMode} />
            <Route path="/more" exact component={More} />
            <Route path="/addtool" exact component={AddTool} />
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;