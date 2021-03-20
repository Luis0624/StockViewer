var api = `PVQO7GOWTICAPNH4`
var dps = [];
var company = null;
var symbol = null;
var chart = null;
var columns = ["Date", "Open", "High", "Low", "Close", "Adjusted Close", "Volume"];
var data1 = []

// Allow user to download stocks data borugh from the external Alpha Vantage API
function download(){
  window.location = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+symbol+"&apikey="+api+"&datatype=csv";
}

// Pulling needed data from API
function getting_data(){
  if(company !== null){
      console.log(company);
    $.getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+symbol+"&outputsize=full&apikey="+api)
    .done(function(data){
        console.log(data);
      var date = data["Time Series (Daily)"]
      let a = 20;
      let b = 7;
      for(var d in date){
        var r = d.split("-");
        if(a-- > 0){
          var value = date[d];
          dps.unshift({x: new Date(parseInt(r[0]), parseInt(r[1])-1, parseInt(r[2])), y: parseFloat(value["1. open"])});
          if(b-- > 0){
            let c = [d, value["1. open"], value["2. high"], value["3. low"], value["4. close"], value["5. adjusted close"], value["6. volume"]];
            data1.push(c);
          }
        }else{
          break;
        }
      }

    
      console.log(document.getElementById("symbol-input").value);

      

      graph();
      drawTable();
      document.getElementById("loading_container").style.display = "none";
      document.getElementById("download_data").style.display = "block";
      document.getElementById("get_data").disabled = false;
      document.getElementById("chartContainer").disabled = false;
    })
    .fail(function(textStatus, error){
      alert(textStatus+" "+error+"\nReload the page");
    })
  }
}

function graph(){
  chart = new CanvasJS.Chart("chartContainer", {
    title:{
      text: company.toUpperCase()
    },
    animationEnabled: true,
    theme: "light2",
    axisY:{
      title: "Open Prices",
      includeZero: false
    },
    axisX:{
      title: "Date",
      valueFormatString: "DD-MMM"
    },
    data: [{        
      type: "line",
          indexLabelFontSize: 16,
      dataPoints: dps
    }]
  });
  chart.options.data[0].dataPoints = dps;
  chart.render();
}


function getData(){
  if(chart !== null){
    chart.destroy();
  }
  data1 = [];
  dps = [];
  document.getElementById("table_container").innerHTML = "";
  company = document.getElementById("symbol-input").value;
  let r = company.split("(");
  symbol = document.getElementById("symbol-input").value;
  console.log(symbol);
  document.getElementById("loading_container").style.display = "block";
  document.getElementById("download_data").style.display = "none";
  document.getElementById("get_data").disabled = true;
  document.getElementById("chartContainer").disabled = true;
  getting_data();
}

// Stock View table with daily data display 
function drawTable(){
  var table_container = document.getElementById("table_container");
  var tableTitle = document.createElement("p");
  tableTitle.id = "tableTitle";
  tableTitle.className = "fontFam"
  var cell = document.createTextNode("RECENT END OF DAY PRICES");
  tableTitle.appendChild(cell);
  table_container.appendChild(tableTitle);
  var table = document.createElement("table");
  table.className = "table fontFam centered";
  var row = document.createElement("tr");
  for(let i=0;i<columns.length;i++){
    var col = document.createElement("th");
    col.scope = "col";
    cell = document.createTextNode(columns[i]);
    col.appendChild(cell);
    row.appendChild(col);
  }
  table.appendChild(row);
  for(let i=0;i<7;i++){
    row = document.createElement("tr");
    for(let j=0;j<7;j++){
      col = document.createElement("td");
      cell = document.createTextNode(data1[i][j]);
      col.appendChild(cell);
      row.appendChild(col);
    }
    table.appendChild(row);
  }
  table_container.appendChild(table);
}
