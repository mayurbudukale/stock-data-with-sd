import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   data;dates;
   sum = 0; deviationSum =0;stdDeviation;
   displayDataArray = [];
   displayedColumns: string[] = ['Open'];
   averageRate;deviationAvaerage;selectedSymbol;
   displayData = {};selectedValue:string;
   
   //available equity symbols
   listOfSymbols: string[] = ['MSFT','GOOGL','GOOG','T','AAPL','AMZN','NFLX','NVDA','INTC','BABA','SQ','BAC'];
  
  constructor(private http : HttpClient) { }
  ngOnInit() {
    //set deafult value to dropdown
    this.selectedSymbol = this.listOfSymbols[0];
    this.getData();
  
  }
 onChange(getselect){
   this.selectedSymbol = getselect;
   this.getData();
 }
  getData(){
    return this.http.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + this.selectedSymbol + "&apikey=2FU7NOHHEXGFQD98")
    .subscribe(result => { 
      this.data;this.dates;this.displayData ={};this.displayDataArray = [];
      this.sum = 0;this.deviationSum = 0;this.stdDeviation;this.averageRate;this.deviationAvaerage;
             this.data = JSON.parse(JSON.stringify(result));
             this.data = this.data["Time Series (Daily)"];
             this.dates = Object.keys(this.data);

             //Create an array of objects which will have all the required data
             for(var i =0; i < 15;i++){
                 this.displayData[i] = {
                      month : this.dates[i],
                      open : parseFloat((this.data[Object.keys(this.data)[i]])["1. open"]).toFixed(2),
                      high : parseFloat((this.data[Object.keys(this.data)[i]])["2. high"]).toFixed(2),
                      low : parseFloat((this.data[Object.keys(this.data)[i]])["3. low"]).toFixed(2),
                      close : parseFloat((this.data[Object.keys(this.data)[i]])["4. close"]).toFixed(2)
                 }
                  this.displayDataArray.push(this.displayData[i]);
             }
             //sum for getting the average of last 15 days closing prices
             for(var i =0; i< 15;i++){
                this.sum += parseFloat(this.displayDataArray[i].close);
             }
             this.averageRate = (this.sum/15).toFixed(2);
             //deviation = closing price - average
             //deviationSquared = deviation*deviation
             for(var i =0;i<15;i++){
               this.displayDataArray[i].deviation = (parseFloat(this.displayDataArray[i].close) - this.averageRate).toFixed(2);
               this.displayDataArray[i].deviationSquared = this.displayDataArray[i].deviation * this.displayDataArray[i].deviation;
             }
             //calculate the average of deviationSqured 
             for(var i =0; i< 15;i++){
              this.deviationSum += parseFloat(this.displayDataArray[i].deviationSquared);
           }
             this.deviationAvaerage =this.deviationSum/15;

             //Standard deviation = sqrt(deviationAverage) 
             this.stdDeviation = (Math.sqrt(this.deviationAvaerage)).toFixed(2);


             //Link used to calculat the standard deviation: https://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:standard_deviation_volatility
        })
  }
}
