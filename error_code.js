// var request = new XMLHttpRequest();
// request.open('GET', api_url, true);
// request.onload = function () {
//     let api_data = JSON.parse(this.response);
//     console.log(api_data);

//     // Get Data and Set Data
//     let min = max = diff = 0;
//     const first_case = api_data.length - 7;

//     for (let i = firstCase; i <apiData.length; i++) {
//         let confirm = api_data[i].Confirmed - api_data[i - 1].Confirmed;

//         min = (confirm < min || min == undefined ? confirm : min);
//         max = (confirm > max || max == undefined ? confirm : max);
//     }

//     diff = max - min;
//     console.log(diff);
// }

// request.send();