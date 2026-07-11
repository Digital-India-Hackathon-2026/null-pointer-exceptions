import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner.jsx';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EligibilityChecker from './pages/EligibilityChecker';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import Profile from './pages/Profile';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checker" element={<EligibilityChecker />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/schemes/:id" element={<SchemeDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <ChatBot />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;