import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Signin from './pages/Signin';
import CreateCollection from './pages/CreateCollection';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Dashboard />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/create-collection' element={<CreateCollection />} />
      </Routes>
    </Router>
  );
}

export default App;
