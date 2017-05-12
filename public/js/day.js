var date = new Date();
var day = date.getDay();

const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

function addDay(d, n){
  var sum = d + n;
  while(sum > 6){
    sum = sum - 7;
  }
  return sum;
}

var days = [];

for(var i = 0; i < 7; i++){
  days.push(daysOfWeek[addDay(day,i)]);
}

console.log(days);
