import './App.css';
import './style.css';
import Navbar from './Components/navbar';
import Calender from './Components/calender';
import Timer from './Components/timer';
import Projects from './Components/projects';
import Tasks from './Components/tasks';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeContextProvider from './Store/context';
import Dashboard from './Components/dashboard';
import Invoice from './Components/invoice';
import InvoiceDetails from './Components/invoiceDetails';

function App() {
  return (
    <div className="App container-fluid p-0">
      <ThemeContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/calender" element={<Calender />} />
            <Route path="/overview/projects" element={<Projects />} />
            <Route path="/overview/tasks" element={<Tasks />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/invoiceDetails" element={<InvoiceDetails />} />
          </Routes>
        </BrowserRouter>
      </ThemeContextProvider>
    </div>
  );
}

export default App;
