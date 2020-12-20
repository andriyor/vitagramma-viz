import './App.css';
import {useEffect} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Chart from "./examples/Chart";
import ChartFetched from "./ChartFetched";
import DateBasedData from "./examples/DateBasedData";
import LineChartwithScrollandZoom from "./examples/LineChartwithScrollandZoom";
import AnimatedBulletAtTheEndOfTheSeries from "./examples/AnimatedBulletAtTheEndOfTheSeries";
import BasicChart from "./examples/BasicChart";


am4core.useTheme(am4themes_animated);

function App() {

  useEffect(() => {
  }, [])

  return (
    <div>
      <h1>BasicChart</h1>
      <BasicChart/>
      <h1>Chart</h1>
      <Chart/>
      <h1>ChartFetched</h1>
      <ChartFetched/>
      <h1>DateBasedData</h1>
      <DateBasedData/>
      <h1>LineChartwithScrollandZoom</h1>
      <LineChartwithScrollandZoom/>
      <h1>AnimatedBulletAtTheEndOfTheSeries</h1>
      <AnimatedBulletAtTheEndOfTheSeries/>
    </div>
  );
}

export default App;
