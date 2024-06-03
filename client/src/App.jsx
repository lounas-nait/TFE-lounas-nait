import { useState } from 'react';
import { Home } from './Pages/Home';
import { Cart } from './Pages/Cart';
import { Favorites } from './Pages/Favorites';
import { Order } from './Pages/Order';
import { AddInstrumentForm } from './components/instrumentForm/AddInstrumentForm';
import Sidebar from './components/menu/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddAvis from './components/avis/AddAvis';
import PaymentForm from './components/paiementForm/PaymentForm';

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
          <Route path="/paymentForm" element={<PaymentForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
