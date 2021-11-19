var updateCount = 0;
var numberElements = 20;

var temperatureChartInstance = new Chart(document.getElementById("chart-temperature").getContext("2d"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Temperature",
            tension: 0.4,
            borderWidth: 0,
            pointRadius: 0,
            borderColor: "#cb0c9f",
            backgroundColor: gradientStroke1,
            data: [],
            maxBarThickness: 6,
            fill : false

            },
            
        ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
    },
    scales: {
        yAxes: [{
        gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: '#dee2e6',
            zeroLineColor: '#dee2e6',
            zeroLineWidth: 1,
            zeroLineBorderDash: [2],
            drawBorder: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
        xAxes: [{
        gridLines: {
            zeroLineColor: 'rgba(0,0,0,0)',
            display: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
    },
    },
});
    //Graph Realtime Variable Implementation
    var valueRef = firebase.database().ref(databasepush);
    valueRef.on('child_added', function (snapshot) {
        var temperaturPoint = snapshot.val().temperature;
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
        var timestamp = snapshot.val().Ts;
        var convertts = new Date(timestamp);
        var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
        var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
        addData(temperatureChartInstance,time, temperaturPoint);
    });

    function addData(chart,label, data) {
        if(data){
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
                if(updateCount > numberElements){
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                else updateCount++;
                chart.update();
            });
        }
    }



var humidityChartInstance = new Chart(document.getElementById("chart-airHum").getContext("2d"), {
    type: "line",
    data: {
    labels: [],
    datasets: [
        {
        label: "Air Humidity",
        tension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        borderColor: "#3A416F",
        borderWidth: 3,
        backgroundColor: gradientStroke2,
        data: [],
        maxBarThickness: 6

        },
    ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        tooltips: {
            enabled: true,
            mode: "index",
            intersect: false,
        },
        scales: {
            yAxes: [{
            gridLines: {
                borderDash: [2],
                borderDashOffset: [2],
                color: '#dee2e6',
                zeroLineColor: '#dee2e6',
                zeroLineWidth: 1,
                zeroLineBorderDash: [2],
                drawBorder: false,
            },
            ticks: {
                padding: 10,
                fontSize: 11,
                fontColor: '#adb5bd',
                lineHeight: 3,
                fontStyle: 'normal',
                fontFamily: "Open Sans",
            },
            }, ],
            xAxes: [{
            gridLines: {
                zeroLineColor: 'rgba(0,0,0,0)',
                display: false,
            },
            ticks: {
                padding: 10,
                fontSize: 11,
                fontColor: '#adb5bd',
                lineHeight: 3,
                fontStyle: 'normal',
                fontFamily: "Open Sans",
            },
            }, ],
        },
    },
});
//Graph Realtime Variable Implementation
    var valueHum = firebase.database().ref(databasepush);
    valueHum.on('child_added', function (snapshot) {
        var humidityVar = snapshot.val().humidity;
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
        var timestamp = snapshot.val().Ts;
        var convertts = new Date(timestamp);
        var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
        var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
        addDataHumidity(humidityChartInstance, time, humidityVar);
    });
    function addDataHumidity(chart,label, data) {
        if(data){
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
                if(updateCount > numberElements){
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                else updateCount++;
                chart.update();
            });
        }
    }



var soilTempChartInstance = new Chart(document.getElementById("chart-soilTemp").getContext("2d"), {
    type: "bar",
    data: {
    labels: [],
    datasets: [{
        label: "Soil Temperature",
        tension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        backgroundColor: "#fff",
        data: [],
        maxBarThickness: 6
    }, ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
    },
    scales: {
        yAxes: [{
        gridLines: {
            display: false,
        },
        ticks: {
            suggestedMin: 25,
            suggestedMax: 35,
            padding: 0,
            fontSize: 14,
            lineHeight: 3,
            fontColor: "#fff",
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
        xAxes: [{
        gridLines: {
            display: false,
        },
        ticks: {
            display: false,
            padding: 20,
        },
        }, ],
    },
    },
});
    //Graph Realtime Variable Implementation
    var valueSoilTemp = firebase.database().ref(databasepush);
    valueSoilTemp.on('child_added', function (snapshot) {
        var soiltemperature = snapshot.val().soilTemp;
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
        var timestamp = snapshot.val().Ts;
        var convertts = new Date(timestamp);
        var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
        var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
        addDataSoilTemp(soilTempChartInstance, time, soiltemperature);
    });
    function addDataSoilTemp(chart, label, data) {
        if(data){
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
                if(updateCount > numberElements){
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                else updateCount++;
                chart.update();
            });
        }
    }






var soilHumChartInstance = new Chart(document.getElementById("chart-soilHum").getContext("2d"), {
    type: "line",
    data: {
    labels: [],
    datasets: [{
        label: "Soil Humidity",
        tension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        borderColor: "#cb0c9f",
        data: [],
        maxBarThickness: 6

        },
        
    ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
    },
    scales: {
        yAxes: [{
        gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: '#dee2e6',
            zeroLineColor: '#dee2e6',
            zeroLineWidth: 1,
            zeroLineBorderDash: [2],
            drawBorder: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
        xAxes: [{
        gridLines: {
            zeroLineColor: 'rgba(0,0,0,0)',
            display: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
    },
    },
});

    //Graph Realtime Variable Implementation
    var valueSoilHum = firebase.database().ref(databasepush);
    valueSoilHum.on('child_added', function (snapshot) {
        var soilhumidity = snapshot.val().soilHum;
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
          }
        var timestamp = snapshot.val().Ts;
        var convertts = new Date(timestamp);
        var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
        var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
        addDataSoilHum(soilHumChartInstance, time, soilhumidity);
    });
    function addDataSoilHum(chart, label, data) {
        if(data){
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
                if(updateCount > numberElements){
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                else updateCount++;
                chart.update();
            });
        }
    }




// var co2PpmChartInstance= new Chart(document.getElementById("chart-co2ppm").getContext("2d"), {
//     type: "line",
//     data: {
//     labels: [],
//     datasets: [
//         {
//         label: "PPM",
//         tension: 0.4,
//         borderWidth: 0,
//         pointRadius: 0,
//         borderColor: "#3A416F",
//         backgroundColor: gradientStroke2,
//         data: [],
//         maxBarThickness: 6

//         },
//     ],
//     },
//     options: {
//     responsive: true,
//     maintainAspectRatio: false,
//     legend: {
//         display: false,
//     },
//     tooltips: {
//         enabled: true,
//         mode: "index",
//         intersect: false,
//     },
//     scales: {
//         yAxes: [{
//         gridLines: {
//             borderDash: [2],
//             borderDashOffset: [2],
//             color: '#dee2e6',
//             zeroLineColor: '#dee2e6',
//             zeroLineWidth: 1,
//             zeroLineBorderDash: [2],
//             drawBorder: false,
//         },
//         ticks: {
//             padding: 10,
//             fontSize: 11,
//             fontColor: '#adb5bd',
//             lineHeight: 3,
//             fontStyle: 'normal',
//             fontFamily: "Open Sans",
//         },
//         }, ],
//         xAxes: [{
//         gridLines: {
//             zeroLineColor: 'rgba(0,0,0,0)',
//             display: false,
//         },
//         ticks: {
//             padding: 10,
//             fontSize: 11,
//             fontColor: '#adb5bd',
//             lineHeight: 3,
//             fontStyle: 'normal',
//             fontFamily: "Open Sans",
//         },
//         }, ],
//     },
//     },
// });
//     //RTDB
//     var valueCo2Ppm = firebase.database().ref(databasepush);
//     valueCo2Ppm.on('child_added', function (snapshot) {
//         var co2ppm = snapshot.val().co2ppmCorrected;
//         function addZero(i) {
//             if (i < 10) {i = "0" + i}
//             return i;
//           }
//         var timestamp = snapshot.val().Ts;
//         var convertts = new Date(timestamp);
//         var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
//         var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
//         addDataCo2Ppm(co2PpmChartInstance, time, co2ppm);
//     });
//     function addDataCo2Ppm(chart,label, data) {
//         if(data){
//             chart.data.labels.push(label);
//             chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
//                 if(updateCount > numberElements){
//                     chart.data.labels.shift();
//                     chart.data.datasets[0].data.shift();
//                 }
//                 else updateCount++;
//                 chart.update();
//             });
//         }
//     };


var ldrChartInstance = new Chart(document.getElementById("chart-LDR").getContext("2d"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "LDR Output",
            tension: 0.4,
            borderWidth: 0,
            pointRadius: 0,
            borderColor: "#cb0c9f",
            backgroundColor: gradientStroke1,
            data: [],
            maxBarThickness: 6,
            fill : false

            },
            
        ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
    },
    scales: {
        yAxes: [{
        gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: '#dee2e6',
            zeroLineColor: '#dee2e6',
            zeroLineWidth: 1,
            zeroLineBorderDash: [2],
            drawBorder: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
        xAxes: [{
        gridLines: {
            zeroLineColor: 'rgba(0,0,0,0)',
            display: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
    },
    },
});
    //Graph Realtime Variable Implementation
    var ldrRef = firebase.database().ref(databasepush);
    valueRef.on('child_added', function (snapshot) {
        var lightPoint = snapshot.val().lightStats;
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
            }
        var timestamp = snapshot.val().Ts;
        var convertts = new Date(timestamp);
        var ampm = convertts.getHours() >= 12 ? 'PM' : 'AM';
        var time = addZero(convertts.getHours())+":"+addZero(convertts.getMinutes())+":"+addZero(convertts.getSeconds())+" " + ampm;
        addLdrData(ldrChartInstance,time, lightPoint);
    });

    function addLdrData(chart,label, data) {
        if(data){
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset) => {dataset.data.push(data);
                if(updateCount > numberElements){
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }
                else updateCount++;
                chart.update();
            });
        }
    }
    
var ctx3 ;

var gradientStroke1 = ctx3.createLinearGradient(0, 230, 0, 50);

gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

var gradientStroke2 = ctx3.createLinearGradient(0, 230, 0, 50);

gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors


new Chart(ctx3, {
    type: "line",
    data: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
        label: "Mobile apps",
        tension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        borderColor: "#cb0c9f",
        borderWidth: 3,
        backgroundColor: gradientStroke1,
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
        maxBarThickness: 6

        },
        {
        label: "Websites",
        tension: 0.4,
        borderWidth: 0,
        pointRadius: 0,
        borderColor: "#3A416F",
        borderWidth: 3,
        backgroundColor: gradientStroke2,
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
        maxBarThickness: 6

        },
    ],
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    tooltips: {
        enabled: true,
        mode: "index",
        intersect: false,
    },
    scales: {
        yAxes: [{
        gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: '#dee2e6',
            zeroLineColor: '#dee2e6',
            zeroLineWidth: 1,
            zeroLineBorderDash: [2],
            drawBorder: false,
        },
        ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
        xAxes: [{
        gridLines: {
            zeroLineColor: 'rgba(0,0,0,0)',
            display: false,
        },
        ticks: {
            padding: 10,
            fontSize: 11,
            fontColor: '#adb5bd',
            lineHeight: 3,
            fontStyle: 'normal',
            fontFamily: "Open Sans",
        },
        }, ],
    },
    },
});


