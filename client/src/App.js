import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import necessary router components
import BiodataForm from './components/BiodataForm';
import Profile from './components/Profile';
import ProfileDetails from './components/ProfileDetails';

function App() {
  return (
    <Router> 
      <div className="App">
        <Routes>
          {/* Define Routes for different components */}
          <Route path="/" element={<BiodataForm />} />
          <Route path="/profiles" element={<Profile />} />
          <Route path="/profile/:id" element={<ProfileDetails />} /> {/* Route for ProfileDetails with dynamic ID */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
