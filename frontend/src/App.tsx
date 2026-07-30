import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MarketIntelligence from './pages/MarketIntelligence';
import OpportunityDetails from './pages/OpportunityDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="market-intelligence" element={<MarketIntelligence />} />
          <Route path="opportunities/:id" element={<OpportunityDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
