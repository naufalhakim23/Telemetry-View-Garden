var updateCount = 0;
var numberElements = 20;

var temperatureChartInstance = new Chart(document.getElementById("chart-temperaturevssoiltem").getContext("2d"), {
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
        console.log("data tanah anjim realtime:",snapshot.val())
        var temperature = snapshot.val().temperature;
        var time = new Date().toLocaleTimeString();
        addData(temperatureChartInstance, time, temperature);
    });

    function addData(chart, label, data) {
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
    
    
var ctx3 = document.getElementById("chart-line2").getContext("2d");
var gradientStroke1 = ctx3.createLinearGradient(0, 230, 0, 50);

gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

var gradientStroke2 = ctx3.createLinearGradient(0, 230, 0, 50);

gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors
