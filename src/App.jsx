import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <main className="main-content minimalist">
        <div className="content-area">
          <QRCodeGenerator />
        </div>
      </main>
    </div>
  );
}

export default App;
