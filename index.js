//Get yesterday date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

//Get last week's date
const oneWeek = new Date(yesterday);
oneWeek.setDate(oneWeek.getDate() - 7);

//Change date to ISO format
const y = yesterday.toISOString();
const ow = oneWeek.toISOString();

//Declare Width size
const widgetWidth = 720;
const widgetHeight = 338;
const graphLow = 280;
const graphHeight = 160;
const spaceBetweenDays = 77.875;

//Line Config
const lineWeight = 2;
const verticalLineWeight = .5;
const accentColor1 = new Color('#666FEA', 1);
const accentColor2 = Color.lightGray();

//Error message
const SIRI_TEXT = `There is an error with your widget`;

//API URL
const apiUrl = `https://api.covid19api.com/live/country/malaysia/status/confirmed/date/` + ow;
const apiData = await new Request(apiUrl).loadJSON();

//Declare drawContext
let drawContext = {};

//Create Graph Function
function createGraph() {
    const a = new DrawContext();

    //Draw Context Config
    a.size = new Size(widgetWidth, widgetHeight);
    a.opaque = false;
    a.respectScreenScale = true;

    return a;
}



//Get Data and Set Data
function getData() {
    drawContext = createGraph();
    createTitle();
    
    let min = max = diff = 0;
    const firstCase = apiData.length - 7;

    for (let i = firstCase; i <apiData.length; i++) {
        let confirm = apiData[i].Confirmed - apiData[i - 1].Confirmed;

        min = (confirm < min || min == undefined ? confirm : min);
        max = (confirm > max || max == undefined ? confirm : max);
    }

    diff = max - min;

    const highestIndex = apiData.length - 1;

    for (let i = firstCase, j = highestIndex; i < apiData.length; i++, j--) {
        const day = (new Date(apiData[i].Date)).getDate();
        const cases = apiData[i].Confirmed - apiData[i - 1].Confirmed;
        const calculate = (cases - min) / diff;

        if(i < highestIndex) {
            const nextCases = apiData[i + 1].Confirmed - apiData[i].Confirmed;
            const nextCalculate = (nextCases - min) / diff;
            const point1 = new Point (spaceBetweenDays * i + 50, graphLow - (graphHeight * calculate));
            const point2 = new Point (spaceBetweenDays * (i + 1) + 50, graphLow - (graphHeight * nextCalculate));
            drawLine(point1, point2, lineWeight, accentColor1);
        }

        //Vertical Line
        const point1 = new Point(spaceBetweenDays * i + 50, graphLow - (graphHeight * calculate));
        const point2 = new Point(spaceBetweenDays * i + 50, graphLow);
        drawLine(point1, point2, verticalLineWeight, accentColor2);

        let dayColor = Color.white();

        const casesRect = new Rect(spaceBetweenDays * i + 20, (graphLow - 40) - (graphHeight * calculate), 60, 23);
        const dayRect = new Rect(spaceBetweenDays * i + 27, graphLow + 10, 50, 23);

        drawTextR(cases, casesRect, dayColor, Font.systemFont(22));
        drawTextR(day, dayRect, dayColor, Font.systemFont(22));
    }

    let confirm = apiData[7].Confirmed;
    drawContext.drawText(confirm.toString(), new Point(50, 50));
    
    const img = drawContext.getImage();
    return img;
}

//Draw Case and Date Text
function drawTextR(text, rect, color, font) {
    drawContext.setFont(font);
    drawContext.setTextColor(color);
    drawContext.drawTextInRect(new String(text).toString(), rect);
}



//Draw Line
function drawLine(point1, point2, width, color) {
    let p = new Path();

    p.move(point1);
    p.addLine(point2);

    drawContext.addPath(p);
    drawContext.setStrokeColor(color);
    drawContext.setLineWidth(width);
    drawContext.strokePath();
}



//Create Title
function createTitle() {
    //Write Title
    drawContext.setFont(Font.mediumSystemFont(20));
    drawContext.setTextColor(Color.white());
    drawContext.drawText('🦠Malaysia Covid Stats'.toUpperCase(), new Point(25, 25));

    drawContext.setTextAlignedCenter();
}



//Create Widget function
function createWidget() {
    const widget = new ListWidget();

    //Config
    widget.setPadding(0, 0, 0, 0);
    widget.backgroundImage = (getData());

    return widget;
}



//Start Widget
if (true || config.runsInWidget) {
    let widget = createWidget();

    widget.presentMedium();

    Script.setWidget(widget);
    Script.complete();
} else {
    if (config.runsWithSiri) {
        Speech.speak(SIRI_TEXT);
    }
}