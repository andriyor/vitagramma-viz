import '../App.css';
import {useEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function Chart() {
  const chart = useRef(null);

  useEffect(() => {

    let x = am4core.create("chart", am4charts.XYChart);

    x.paddingRight = 20;

// Add data
    x.data = [
      {
        "year": "2012-01-01",
        "value": 4.5
      },
      {
        "year": "2012-01-10",
        "value": 7.6
      },
      {
        "year": "2012-01-20",
        "value": 8.1
      }];

// Create axes
    let categoryAxis = x.xAxes.push(new am4charts.DateAxis());
    // categoryAxis.dataFields.category = "year";
    categoryAxis.dateFormatter.inputDateFormat = "yyyy-MM-dd";
    categoryAxis.renderer.minGridDistance = 50;
    // categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;

// Create value axis
    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0.3;

    const lowLine = x.series.push(new am4charts.LineSeries());
    lowLine.dataFields.valueY = "value";
    lowLine.dataFields.dateX = "date";
    lowLine.strokeWidth = 2;
    lowLine.strokeDasharray = "5,4";
    lowLine.stroke = lowLine.fill = am4core.color("#c00");
    lowLine.data = [
      {"date": "2012-01-01", "value": 5},
      {"date": "2012-01-22", "value": 5}
    ];

    const highLine = x.series.push(new am4charts.LineSeries());
    highLine.dataFields.valueY = "value";
    highLine.dataFields.dateX = "date";
    highLine.strokeWidth = 2
    highLine.stroke = highLine.fill = am4core.color("#32c421");
    highLine.strokeDasharray = "5,4";
    highLine.data = [
      {"date": "2012-01-01", "value": 2},
      {"date": "2012-01-22", "value": 2}
    ];


// Create series
    let series = x.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "year";
    series.strokeWidth = 2;
    series.minBulletDistance = 15;
    // series.strokeDasharray = '5';
    // series.tensionX = 0.77;

// bullet is added because we add tooltip to a bullet for it to change color
    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.tooltipText = "{valueY}";

    bullet.adapter.add("fill", function (fill, target) {
      if (target.dataItem.valueY > 5) {
        return am4core.color("#FF0000");
      }
      return fill;
    })

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 2;

    let range = valueAxis.createSeriesRange(series);
    range.value = 5;
    range.endValue = 1000;
    range.contents.stroke = am4core.color("#FF0000");
    range.contents.fill = range.contents.stroke;

// Add scrollbar
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    x.scrollbarX = scrollbarX;


    x.cursor = new am4charts.XYCursor();
    chart.current = x;


    return () => {
      x.dispose();
    };
  }, [])


  return (
    <div>
      <div id="chart" style={{width: "100%", height: "500px"}}></div>
    </div>
  );
}

export default Chart;
