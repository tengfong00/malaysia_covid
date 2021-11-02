var canvas = document.getElementById("graph");
var context = canvas.getContext("2d");

// Declare Width Size
var space_between_days = 75;
var graph_height = 450;
var graph_width = 720;
var graph_inline_height = 450;
var graph_inline_width = 576;

// Declare graph config
var line_width = 2;
var vertical_line_weight = .5;
var graph_line_color = "#666FEA";
var graph_horizontal_line_color = "#D3D3D3";

// Draw Background Color
context.fillRect(0, 0, graph_width, graph_height);

var today = new Date();
var yesterday = new Date(today);

const csv = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/epidemic/cases_state.csv";
let results = [];
let weekResults = [];
let dateArray = [];
var min = max = diff = 0;

Papa.parse(csv, {
    header: true,
    download: true,
    complete: response => {
        results = response.data;

        for (let i = 0; i < 7; i++) {
            yesterday.setDate(yesterday.getDate() - 1);

            var month = yesterday.getMonth() + 1;
            var day = yesterday.getDate();
            var year = yesterday.getFullYear();

            var number = "0";

            if (day < 10) {
                day = number + day;
            }

            var newToday = year + "-" + month + "-" + day;
            dateArray[i] = newToday;

            weekResults[i] = results.filter(
                                    x => x.date === newToday
                                ).find(
                                    x => x.state === "Perak"
                                ).cases_new;
        }

        dateArray.reverse();
        weekResults.reverse();

        for (let i = 0; i < weekResults.length; i++) {
            min = (weekResults[i] < min || min == undefined ? weekResults[i] : min);
            max = (weekResults[i] > max || max == undefined ? weekResults[i] : max);
        }
        
        diff = max - min;
        
        for (let i = 0; i < weekResults.length; i++) {
            let day = new Date(dateArray[i]).getDate();
            let calculate = (weekResults[i] - min) / diff;

            let nextCalculate = (weekResults[i + 1] - min) / diff;

            // Graph Line
            context.beginPath();
            context.lineWidth = line_width;
            context.strokeStyle = graph_line_color;
            context.moveTo(space_between_days * i + 135, ((graph_inline_width) - (graph_inline_height * calculate)));
            context.lineTo(space_between_days * (i + 1) + 135, ((graph_inline_width) - (graph_inline_height * nextCalculate)));
            context.stroke();
            
            // Vertical Line
            context.beginPath();
            context.lineWidth = 1.5;
            context.strokeStyle = graph_horizontal_line_color;
            context.moveTo(space_between_days * i + 135, graph_inline_width - (graph_inline_height * calculate));
            context.lineTo(space_between_days * i + 135, graph_inline_width - 150);
            context.stroke();

            // Date & Total Num
            context.beginPath();
            context.font = "15px Roboto";
            context.fillStyle = graph_horizontal_line_color;
            context.fillText(weekResults[i], space_between_days * i + 125, (graph_inline_width - 40) - (graph_inline_height * calculate));
            context.fillText(day, space_between_days * i + 131, (graph_inline_width - 135));
            
            // Tittle
            context.font = "25px Roboto";
            context.fillText("🦠Malaysia Covid Stats", 25, 50);
        }
    }
});