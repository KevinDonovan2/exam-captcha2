import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage';
import SequencePage from './pages/SequencePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/sequence/:n" element={<SequencePage />} />
      </Routes>
    </Router>
  );
};

export default App;
