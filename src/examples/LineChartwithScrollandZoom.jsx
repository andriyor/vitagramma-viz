import '../App.css';
import {useEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function LineChartwithScrollandZoom() {
  const x = useRef(null);

  useEffect(() => {

// Create chart instance
    var chart = am4core.create("LineChartwithScrollandZoom", am4charts.XYChart);
    chart.data = generateChartData();
    chart.data = [{"date": "2020-06-09", "visits": 16.9}, {"date": "2020-01-23", "visits": 14}, {
      "date": "2018-08-28",
      "visits": 22
    }]

// Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "visits";
    series.dataFields.dateX = "date";
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = "{valueY}";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12)

// Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);

// Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    function generateChartData() {
      var chartData = [];
      var firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 1000);
      var visits = 1200;
      for (var i = 0; i < 500; i++) {
        // we create date objects here. In your data, you can have date strings
        // and then set format of your dates using chart.dataDateFormat property,
        // however when possible, use date objects, as this will speed up chart rendering.
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
          date: newDate,
          visits: visits
        });
      }
      return chartData;
    }

    x.current = chart;


    return () => {
      chart.dispose();
    };
  }, [])


  return (
    <div>
      <div id="LineChartwithScrollandZoom" style={{width: "100%", height: "500px"}}></div>
    </div>
  );
}

export default LineChartwithScrollandZoom;
