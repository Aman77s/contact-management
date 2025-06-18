
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddContact from './pages/AddContact';
import Navbar from './components/Navbar';
import EditContact from './pages/EditContact';
import { Toaster } from 'react-hot-toast';
import ImportContact from './pages/importcontact';

const App = () => {
  return (
    <>
   
    <Router>
           <Navbar />
      <Toaster position="top-right" />

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact/create" element={<AddContact />} />
        <Route path="/edit/:id" element={<EditContact />} />
        <Route path='/import' element={<ImportContact/>}   />
      </Routes>
    </Router>
  </>
  );
  
};

export default App;
