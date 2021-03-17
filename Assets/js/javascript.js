var stockList = [];
var companyName;

// Local storage functions 
initTickerList();
initStock();


//This fucntion displays the stocks entered by the user into the DOM 
function renderStock(){
    $("#stockList").empty();
    $("#stockInput").val("");

    for(i=0; i<stockList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary ticker");
        a.attr("data-tickers"), stockList[i];
        a.text("#stockList").prepend(a);
    }

}

// This function pulls the stocks list array from local storage 
function initTickerList() {
    var storedTickers = JSON.parse(localStorage.getItem("Stocks"));

    if(storedTickers !== null) {
        stockList = storedTickers;
    }

    renderStock();
}

//This function pulls the current ticker symbal infos into local storage to display teh current stock
function initStock() {
    var storeddata = JSON.parse(localStorage.getItem("currentTicker"));

    if (storeddata !== null) {
        companyName = storeddata;

                        //displayTickers();      ******* TODO
                        //displayDailyInfos();              ****TODO
    }
}

// This function saves the ticker array to local storage 
function storeTickerArray() {
    localStorage.setItem("tickers", JSON.stringify("stockList"));
}

// This function saves the currently displayed ticker to local storage 
function storeCurrentTicker(){
    localStorage.setItem("currentTicker", JSON.stringify(companyName));
}

// click event handler for ticker search button 
$("#tickerSearchBtn").on("click", function(event){
    event.preventDefault();

    companyName = $("#stockInput").val().trim();
    if(companyName === ""){
        alert("Please enter ticker symbal to look up")

    }else if (stockList.length >=5){
        stockList.shift();
        stockList.push(companyName);

    }else{
        stockList.push(companyName);
    }
    stockFetch();
    displayTickers();
    storeTickerArray();
    storeCurrentTicker();
    renderStock();
                         //displayTickers();    ******TODO
                        //displayDailyInfos(); ******TODO
});

//event handler for if the user clicks enter after entering the ticker search term
$("#stockInput").keypress(function(e){
    if(e.which == 13){
        $("#tickerSearchBtn").click();
    }

})



var daysToShow = 20;
var apiKey= "9JC9QYQ5JH3L8UOI";
var url= `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${companyName}&apikey=${apiKey}`;
var points = [];

function stockFetch(){
    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
        var days = Object.values( data["Time Series (Daily)"] );
        console.log( days );
        for (var i = daysToShow - 1; i >= 0; i--) {
            var coordinates = Number( days[i]['4. close'] )
            points.push(coordinates)
        }
        console.log( points);
        var labels = Object.keys( data["Time Series (Daily)"] ).splice(0, daysToShow).reverse()
        var 

    
        var ctx = document.getElementById('myChart').getContext('2d');
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'close',
                    borderColor: 'rgb(255, 99, 132)',
                    data: points
                }]
            },
            options: {}
        });
    });
}

// This function runs to open Tickers API AJAX calll and display current ticker 
async function displayTickers() {
    var apiKey= "9JC9QYQ5JH3L8UOI";
   var queryURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${companyName}&apikey=${apiKey}`;

   var response = await $.ajax({
       url: queryURL,
       method: "GET"
   })
   console.log(response);

   var symbol = response.Symbol;
   var name = response.name
   var sector = response.Sector;
   //var lastVolume = response['Time Series (1min)'][lastRefreshed]['5. volume']
   var movingAverage = response[`50DayMovingAverage`]

console.log(symbol,movingAverage);

   $('#stockSymbol').text(symbol);
   $('#sector').text(sector);
   $('#stockVolume').text(numberWithCommas(lastVolume));
   $("#stockIndicator").hide();

   }


    // new written code
    // if ($('#jive-widgets-browser').css('display') == 'block') {
    //     // Do Nothing as we are in edit mode
        
    //     } else {
    //     // Build the URL to Alpha Vantage
    //     // var q = escape('select * from yahoo.finance.quotes where symbol in ("' + yourStockSymbol + '")');
    //     var theURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${companyName}&apikey=${apiKey}`;
        
        
    //     $(document).ready(function(){
    //     // Load function on launch
    //       $("#stockIndicator").show();
    //       doAjax(theURL);
        
    //     // Function for refreshing the stock by clicking on the title header
    //     $('.ajaxtrigger').click(function(){
    //       $("#stockIndicator").show();
    //       doAjax(theURL);
    //         return false;
    //       });
        
    //     // Function to add commas to numbers for volume
    //       function numberWithCommas(x) {
    //         return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
    //       }
        
    //     // Main function to make JSON request to Alpha Vantage for stock information
    //       function doAjax(url){
    //       $.ajax({
    //         url: url,
    //         dataType: 'jsonp',
    //         contentType: "application/json",
    //         success: function(data){
    //           var s = data.query.results;
    //               if(s){
    //           if(s.quote.Change > 0) {
    //             // Change the change text to green
    //             $('#stockChange').css({'color': 'green'});
    //             $('#stockChangePercent').css({'color': 'green'});
    //           } else {
    //             // Change the change text to red
    //             $('#stockChange').css({'color': 'red'});
    //             $('#stockChangePercent').css({'color': 'red'});
    //           }
        
    //           console.log('s is' + s);
        
    //           // This is where we add the JSON values back into the HTML above
    //           $('#stockSymbol').html(s.quote.symbol);
    //           $('#sector').html(s.quote.LastTradePriceOnly);
    //           $('#stockChange').html(s.quote.Change);
    //           $('#stockChangePercent').html(s.quote.ChangeinPercent);
    //           $('#stockVolume').html(numberWithCommas(s.quote.Volume));
    //           $('#stockAvgVolume').html(numberWithCommas(s.quote.AverageDailyVolume));
    //           $('#stockRange').html(s.quote.YearRange);
        
    //           $("#stockIndicator").hide();
        
    //               } else {
    //                 var errormsg = '<p>Error: could not load the page.</p>';
    //           $("#stockIndicator").show();
    //                 $("#stockIndicator").html(errormsg);
    //               }
    //             }
    //           });
        
    //       }
        
        
    //       }); //end ready function
        
    //     } //end first else
        