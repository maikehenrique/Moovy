import './global.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "@mdi/font/css/materialdesignicons.min.css";

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from '../src/pages/Home'
import MyLibrary from './pages/MyLibrary';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/mylibrary" element={<MyLibrary/>}/>
      </Routes>
    </Router>
  );
}

export default App;
