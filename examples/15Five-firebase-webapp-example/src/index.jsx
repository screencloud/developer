import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import DataLoader from './components/data-loader/DataLoader';
import { ScPlayerInterface } from './components/player/ScPlayerInterface';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScPlayerInterface>
      {(data) => {
        return (
          <React.Fragment>
            <DataLoader appStarted={data.appStarted} config={data.config} />
          </React.Fragment>
        );
      }}
    </ScPlayerInterface>
  </React.StrictMode>,
);
