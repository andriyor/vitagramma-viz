import '../App.css';
import {useEffect, useRef} from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

function AnimatedBulletAtTheEndOfTheSeries() {
  const x = useRef(null);

  useEffect(() => {

// Create chart instance
    var chart = am4core.create("AnimatedBulletAtTheEndOfTheSeries", am4charts.XYChart);
// Add data
    chart.data = [{
      "date": new Date(2018, 3, 20),
      "value": 90
    }, {
      "date": new Date(2018, 3, 21),
      "value": 102
    }, {
      "date": new Date(2018, 3, 22),
      "value": 65
    }, {
      "date": new Date(2018, 3, 23),
      "value": 62
    }, {
      "date": new Date(2018, 3, 24),
      "value": 55
    }, {
      "date": new Date(2018, 3, 25),
      "value": 81,
      "disabled": false
    }];

// Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

// Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "value";
    lineSeries.dataFields.dateX = "date";
    lineSeries.name = "Sales";
    lineSeries.strokeWidth = 3;
    lineSeries.strokeDasharray = "5,4";

// Add simple bullet
    var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.disabled = true;
    bullet.propertyFields.disabled = "disabled";

    var secondCircle = bullet.createChild(am4core.Circle);
    secondCircle.radius = 6;
    secondCircle.fill = chart.colors.getIndex(8);


    bullet.events.on("inited", function (event) {
      animateBullet(event.target.circle);
    })


    function animateBullet(bullet) {
      var animation = bullet.animate([{property: "scale", from: 1, to: 5}, {
        property: "opacity",
        from: 1,
        to: 0
      }], 1000, am4core.ease.circleOut);
      animation.events.on("animationended", function (event) {
        animateBullet(event.target.object);
      })
    }


    x.current = chart;


    return () => {
      chart.dispose();
    };
  }, [])


  return (
    <div>
      <div id="AnimatedBulletAtTheEndOfTheSeries" style={{width: "100%", height: "500px"}}></div>
    </div>
  );
}

export default AnimatedBulletAtTheEndOfTheSeries;
