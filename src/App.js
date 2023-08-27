// App.js
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import BarChart from './BarChart';
// import WebROut from './webrExample';
import SpaghettiPlot from './SpaghettiPlot';
import SaveSVGButton from './SaveSVGButton';
import ForestPlot from './ForestPlot';
//import SasData from './SasData';

function App() {
    const [activeTab, setActiveTab] = useState('barchart');

    return (
        <div className="App">
          <SaveSVGButton svgSelector={`svg#${activeTab}`} />
          <Tabs
            defaultActiveKey="barchart"
            id="tabs"
            className="mb-3"
            onSelect={(key) => setActiveTab(key)}
          >
            <Tab eventKey="barchart" title="Barchart">
              <BarChart width={600} height={400} />
            </Tab>
            <Tab eventKey="spaghetti" title="Spaghetti Plot">
              <SpaghettiPlot width={600} height={400}/>
            </Tab>
            <Tab eventKey="forest" title="Forest Plot">
              <ForestPlot width={600} height={400} />
            </Tab>
            <Tab eventKey="sasdata" title="SAS Data">
              { /*<SasData /> */}
              <h1>In progress...</h1>
            </Tab>
          </Tabs>
        </div>
    );
}

export default App;
