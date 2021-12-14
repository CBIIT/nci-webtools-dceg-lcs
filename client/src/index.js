import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LCScreening from './LCScreening';
import LCRisk from './LCRisk';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot, useRecoilState } from "recoil";


ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      {process.env.REACT_APP_PROJECT === 'LCScreening' ? <LCScreening /> : <LCRisk />}
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
