import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DataLoader from "./components/data-loader/DataLoader";
import reportWebVitals from './reportWebVitals';
import {ScPlayerInterface} from "./components/player/ScPlayerInterface";

ReactDOM.render(
    <React.StrictMode>
        <ScPlayerInterface>
            {data => {
                return <React.Fragment>
                    <DataLoader appStarted={data.appStarted} config={data.config} />
                </React.Fragment>
            }}

        </ScPlayerInterface>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
