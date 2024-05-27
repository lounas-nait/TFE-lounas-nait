import { useState } from 'react';
import { Home } from './Pages/Home';
import { Cart } from './Pages/Cart';
import { Favorites } from './Pages/Favorites';
import { Order } from './Pages/Order';
import { AddInstrumentForm } from './components/AddInstrumentForm';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddAvis from './components/AddAvis';

function App() {

  return (
    <div className="App">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favs" element={<Favorites />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/addInstrumentForm" element={<AddInstrumentForm />} />
          <Route path="/add-review/:id" element={<AddAvis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
