import './App.css';
import {useEffect, useState, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import dayjs from "dayjs";

am4core.useTheme(am4themes_animated);

function ChartFetched() {
  const [results, setResults] = useState(null);
  const [dict, setDict] = useState({});
  const [birthday, setBirthday] = useState('1997-09-18');
  const [filtered, setFiltered] = useState({});
  const chart = useRef(null);


  const renderChart = (data, min, max) => {
    let x = am4core.create("chartFetched", am4charts.XYChart);


// Add data
    x.data = data;

// Create axes
    let categoryAxis = x.xAxes.push(new am4charts.DateAxis());
    categoryAxis.dataFields.category = "issued";
    categoryAxis.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    categoryAxis.renderer.minGridDistance = 100;
    categoryAxis.startLocation = -10;
    categoryAxis.endLocation = 10;

// Create value axis
    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0.3;
    valueAxis.min = -1;

    const lowLine = x.series.push(new am4charts.LineSeries());
    lowLine.dataFields.valueY = "value";
    lowLine.dataFields.dateX = "issued";
    lowLine.strokeWidth = 2;
    lowLine.strokeDasharray = "5,4";
    lowLine.stroke = lowLine.fill = am4core.color("#32c421");
    lowLine.data = min;


    const highLine = x.series.push(new am4charts.LineSeries());
    highLine.dataFields.valueY = "value";
    highLine.dataFields.dateX = "issued";
    highLine.strokeWidth = 2
    highLine.stroke = highLine.fill = am4core.color("#32c421");
    highLine.strokeDasharray = "5,4";
    highLine.data = max;


// Create series
    let series = x.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "issued";
    series.strokeWidth = 2;
    series.paddingRight = 100
    // series.minBulletDistance = 15;
    // series.strokeDasharray = '5';
    // series.tensionX = 0.77;

    var labelBullet1 = series.bullets.push(new am4charts.LabelBullet());
    labelBullet1.disabled = true;
    labelBullet1.propertyFields.disabled = "bulletDisabled";
    labelBullet1.label.text = "{valueY.previousChange}";
    labelBullet1.horizontalCenter = "left";
    labelBullet1.label.horizontalCenter = "left";
    labelBullet1.label.paddingLeft = 10;

// bullet is added because we add tooltip to a bullet for it to change color
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.tooltipText = "{valueY}";

    bullet.adapter.add("fill", function (fill, target) {
      if (target.dataItem.valueY > max[0].value) {
        return am4core.color("#FF0000");
      }
      return fill;
    })

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 2;

    let range = valueAxis.createSeriesRange(series);
    range.value = max[0].value;
    range.endValue = 1000;
    range.contents.stroke = am4core.color("#FF0000");
    range.contents.fill = range.contents.stroke;

    x.scrollbarX = new am4charts.XYChartScrollbar();
    x.scrollbarX.series.push(series);
    x.scrollbarX.parent = x.bottomAxesContainer;


    x.cursor = new am4charts.XYCursor();
    chart.current = x;


    return () => {
      x.dispose();
    };
  }

  useEffect(() => {
    fetch('http://localhost:4800/observationsReport')
      .then(response => response.json())
      .then(data => setResults(data));


  }, [])


  useEffect(() => {
    if (results) {
      console.log(results);
      const dict = {}
      results.forEach(result => {
        result?.itemResults?.forEach(item => {
          item.result.forEach(i => {
            if (i.valueQuantity) {
              if (dict[i.title]) {
                dict[i.title].push(i);
              } else {
                dict[i.title] = [i];
              }
            }
          })
        })
      });
      setDict(dict);
    }
  }, [results])

  useEffect(() => {
    if (dict) {
      const filtered = {};
      for (const dictKey in dict) {
        if (dict[dictKey].length >= 3 && dict[dictKey].every(res => Array.isArray(res.referenceRange))) {
          filtered[dictKey] = dict[dictKey];
        }
      }
      setFiltered(filtered);
    }
  }, [dict])

  const buildChartData = (data) => {
    return data.map(observation => {
      const obs = {issued: observation.issued};
      if (observation.valueQuantity) {
        obs.value = observation.valueQuantity.value;
      }
      return obs;
    })
  }

  const buildChartMax = (data) => {
    return data.map(observation => {
      const obs = {issued: observation.issued};
      const currentAge = dayjs(observation.issued).subtract(dayjs(birthday).year(), 'year').year();
      const referenceIndex = observation.referenceRange.findIndex((range) => range.age.low <= currentAge && range.age.high >= currentAge);
      obs.value = observation.referenceRange[referenceIndex].high;
      return obs;
    })
  }

  const buildChartMin = (data) => {
    return data.map(observation => {
      const obs = {issued: observation.issued};
      const currentAge = dayjs(observation.issued).subtract(dayjs(birthday).year(), 'year').year();
      const referenceIndex = observation.referenceRange.findIndex((range) => range.age.low <= currentAge && range.age.high >= currentAge);
      obs.value = observation.referenceRange[referenceIndex].low;
      return obs;
    })
  }

  useEffect(() => {
    if (Object.keys(filtered).length > 0) {
      console.log(filtered);
      console.log(filtered['Білірубін загальний']);
      const data = buildChartData(filtered['Білірубін загальний']);
      const min = buildChartMin(filtered['Білірубін загальний']);
      const max = buildChartMax(filtered['Білірубін загальний']);
      console.log(min);
      console.log(data);
      renderChart(data, min, max);
    }
  }, [filtered])


  return (
    <div>
      <div id="chartFetched" style={{width: "100%", height: "500px"}}></div>
    </div>
  );
}

export default ChartFetched;