import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Main from './components/Main/Main';
import RehearsePage from './components/RehearsePage/RehearsePage';
import VocabulariumList from './components/VocabulariumList/VocabulariumList';
import Reader from './components/Reader/Reader';
import AddTool from './components/AddTool/AddTool';
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <div className="App">
      {
        <Router>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/rehearse" exact component={RehearsePage} />
            <Route path="/vocabulariumlist" exact component={VocabulariumList} />
            <Route path="/reader" exact component={Reader} />
            <Route path="/addtool" exact component={AddTool} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;