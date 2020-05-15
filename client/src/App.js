import React from 'react';
import MenuBar from './component/MenuBar.js';
import { Home } from './component/Home';
import Refactoring from './component/Refactoring';
import About from './component/About';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends React.Component {
  render () {
    return (
      <Router>
       <MenuBar/>
       <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/refactoring" component={Refactoring}/>
        <Route path="/about" component={About}/>
       </Switch>
      </Router>
    )
  }
}

export default App;
