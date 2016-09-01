var argv = require('minimist')(process.argv.slice(2));
var readline = require('linebyline');

if (argv._[0]) {
  var logFile = argv._[0];
} else {
  console.log("You must type name of statistic file. Example - node stat.js stat.txt");
  return;
}

var rl = readline(logFile);

var totalWins = 0;
var totalFails = 0;
var totalStays = 0;
var totalGames = 0;

var winsInRow = 1;
var failsInRow = 1;
var maxWinsInRow = 1;
var maxFailsInRow = 1;

var win = false;
var fail = false;

rl.on('line', function(line, lineCount, byteCount) {
    if (line === 'win') {
      totalWins++;
      if (win) {
        winsInRow++;
      } else {
        winsInRow = 1;
      }
      if (maxWinsInRow < winsInRow) maxWinsInRow = winsInRow;
      win = true;
      fail = false;
      totalGames++;
    }

    if (line === 'fail') {
      totalFails++;
      if (fail) {
        failsInRow++;
      } else {
        failsInRow = 1;
      }
      if (maxFailsInRow < failsInRow) maxFailsInRow = failsInRow;
      win = false;
      fail = true;
      totalGames++;
    }

    if (line === 'stay') {
      totalStays++;
      win = false;
      fail = false;
      totalGames++;
    }

})
.on('end', function () {
  if (totalGames == 0) {
    throw "File is empty";
  }
  console.log("Total games - " + totalGames + "\n");

  console.log("Total wins - " + totalWins);
  console.log("Total fails - " + totalFails);
  console.log("Total stays - " + totalStays + "\n");

  console.log("Max wins in row - " + maxWinsInRow);
  console.log("Max fails in row - " + maxFailsInRow + "\n");

  let winPercent = 100 * totalWins / totalGames;
  let failPercent = 100 * totalFails / totalGames;
  let stayPercent = 100 * totalStays / totalGames;

  console.log("wins - " + winPercent.toFixed(2)
                        + "% / fails - " + failPercent.toFixed(2)
                        + "% / stays - " + stayPercent.toFixed(2)
                        + "%");
})
.on('error', function(e) {
  console.log(e);
});
