import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Main from './components/Main/Main';
import Vocabularium from './components/Vocabularium/Vocabularium';
import RehearsePage from './components/RehearsePage/RehearsePage';
import VocabulariumList from './components/VocabulariumList/VocabulariumList';
import More from './components/More/More';
import AddTool from './components/AddTool/AddTool';

function App() {
  return (
    <div className="App">
      {
        <Router>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/vocabularium" exact component={Vocabularium} />
            <Route path="/vocabularium/rehearse" exact component={RehearsePage} />
            <Route path="/vocabularium/list" exact component={VocabulariumList} />
            <Route path="/more" exact component={More} />
            <Route path="/addtool" exact component={AddTool} />
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;