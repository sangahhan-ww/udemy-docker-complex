import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import otherPage from './other-page';
import Fib from './fib';

function App() {
  return (
    <Router>
      <div className="App">
      <h1>Fib Calculator</h1>
      <Link to="/">Home</Link> | <Link to="/other-page">Other page</Link>
      <Route exact path="/" component={Fib} />
      <Route path="/other-page" component={otherPage} />    
      </div>
    </Router>
  );
}

export default App;
