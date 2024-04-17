import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Start from './components/Start';
import Quiz from './components/Quiz';
import Result from './components/Result';

function App() {
  return (
    // Wrap the application in a BrowserRouter to enable routing
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
            <Route path="/" element={<Layout />}>
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
            </Route>
        </Routes>
      </BrowserRouter >
  );
}

export default App;
