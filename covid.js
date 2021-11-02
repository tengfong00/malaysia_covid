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

// Declare Variable
var today = new Date();
var yesterday = new Date (today);
yesterday.setDate(yesterday.getDate() - 1);
var one_week = new Date (yesterday);
one_week.setDate(one_week.getDate() - 7);

var yesterday_ISO = yesterday.toISOString();
var one_week_ISO = one_week.toISOString();

// Draw Background Color
context.fillRect(0, 0, graph_width, graph_height);

//API URL
var api_url = `https://api.covid19api.com/live/country/malaysia/status/confirmed/date/` + one_week_ISO;

fetch(api_url)
    .then(response => { return response.json() })
    .then (api_data => {
        let min = max = diff = 0;
        let confirmArray = [];
        let dateArray = [];

        for (let i = 0; i < api_data.length; i++) {
            if (api_data[i].Province == "Perak") {
                confirmArray.push(api_data[i].Confirmed);
                dateArray.push(api_data[i].Date);
            }
        }

        for (let i = 1; i <confirmArray.length; i++) {
            let confirm = confirmArray[i] - confirmArray[i - 1];
    
            min = (confirm < min || min == undefined ? confirm : min);
            max = (confirm > max || max == undefined ? confirm : max);
        }
    
        diff = max - min;

        let highest_index = confirmArray.length - 1;

        for (let i = 1, j = highest_index; i < confirmArray.length; i++, j--) {
            let day = (new Date(dateArray[i])).getDate();
            let cases = confirmArray[i] - confirmArray[i - 1];
            let calculate = (cases - min) / diff;

            if (i < highest_index) {
                let nextCases = confirmArray[i + 1] - confirmArray[i];
                let nextCalculate = (nextCases - min) / diff;

                context.beginPath();
                context.lineWidth = line_width;
                context.strokeStyle = graph_line_color;
                context.moveTo(space_between_days * i + 50, ((graph_inline_width) - (graph_inline_height * calculate)));
                context.lineTo(space_between_days * (i + 1) + 50, ((graph_inline_width) - (graph_inline_height * nextCalculate)));
                context.stroke();
            }

            // Vertical Line
            context.beginPath();
            context.lineWidth = 1.5;
            context.strokeStyle = graph_horizontal_line_color;
            context.moveTo(space_between_days * i + 50, graph_inline_width - (graph_inline_height * calculate));
            context.lineTo(space_between_days * i + 50, graph_inline_width - 150);
            context.stroke();

            context.beginPath();
            context.font = "15px Roboto";
            context.fillStyle = graph_horizontal_line_color;
            context.fillText(cases, space_between_days * i + 40, (graph_inline_width - 40) - (graph_inline_height * calculate));
            context.fillText(day, space_between_days * i + 46, (graph_inline_width - 135));
            
            let confirm = confirmArray[7];
            context.font = "25px Roboto";
            context.fillText("🦠Malaysia Covid Stats", 25, 50);
            context.fillText(confirm.toString(), 60, 75);
        }
        
    })
    .catch(err => console.log('Request failed', err));