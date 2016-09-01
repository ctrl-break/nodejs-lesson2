'use strict';
console.log('\x1Bc');

const cards = require('french-deck');
const readline = require('readline');
const inarray = require('inarray');
const clc = require('cli-color');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');


const red = clc.red.bold;
const yellow = clc.yellow.bold;
const green = clc.green.bold;
const magenta = clc.magenta.bold;



const getCardScore = (card) => {
    if (isNaN(card.rank)) {
        if (card.rank === 'ace') {
            return 11;
        }
        return 10;
    } else {
        return Number(card.rank);
    }
}

const getSummaryScores = (array) => {
    let result = 0;
    array.forEach(function(item) {
        result += getCardScore(item);
    });
    return result;
}

const prettyPrintCards = (cards) => {
   let result = "Cards -";
   cards.forEach(function(card) {
       result += " / " + card.rank + "-" + card.suit;
   });
   return result + "\n**********\n";
};

const printCurrentState = (hands, checkDealer) => {
    let dealerSum = "?";
    if (checkDealer) {
      dealerSum = getSummaryScores(hands[0]);
    };

    let dealer = `Dealer - ${dealerSum}\n`;
    if (checkDealer) {
      dealer += prettyPrintCards(hands[0]);
    };

    let playerSum = getSummaryScores(hands[1]);
    let player = `Player - ${playerSum}\n`;
    player += prettyPrintCards(hands[1]);

    return dealer + player;
}

const dealNewCards = () => {
  return deck.deal(2, 2);
}

const newRound = (hands) => {
  console.log(magenta("- - - New round - - -\n"));
  hands = dealNewCards();
  console.log(printCurrentState(hands));
  console.log(yellow("Choose action: deal|d  check|c  exit|e"));
  return hands;
}

const dealerWork = () => {
  while ( getSummaryScores(hands[0]) < 17 ) {
    hands[0].push(deck.draw());
  }
}

//make log file
if (argv._[0]) {
  var logFile = argv._[0];
  fs.stat(logFile, function (err, file) {
    if (err != null) {
        fs.writeFile(logFile, '', function(err) {
          if (err) throw err;
        });
    };
  });
  var needLog = true;
} else {
  var logFile = "";
  var needLog = false;
}

const writeLog = (roundResult) => {
      fs.appendFile(logFile, roundResult + "\n", function(err) {
        if (err) throw err;
      });
};


//Prepare for game
let exit = ['Exit', 'exit', 'e', 'E'];
let deal = ['Deal', 'deal', 'd', 'D'];
let check = ['Check', 'check', 'c', 'C'];
let deck = new cards.Deck({
    jokers: 0,
    decks: 1
});
deck.shuffle();

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Game
let hands = newRound(); // hands[0] - dealer cards, hands[1] - player cards

rl.on('line', function(cmd) {

    let result = '';
    if (deck._undealt.length <= 4) {
        console.log("Deck is empty. Take new deck.\n");
        deck.reset();
        deck.shuffle();
        hands = newRound();
    }

    if ( inarray(exit, cmd) ) {
        this.close();
        return;
    };

    if ( inarray(deal, cmd) ) {
        hands[1].push(deck.draw());
        console.log(printCurrentState(hands));
        if ( getSummaryScores( hands[1] ) > 21 ){
          console.log(red("You fail!\n"));
          result = 'fail';
          hands = newRound();
          if (needLog) writeLog(result);
        }
    };

    if ( inarray(check, cmd) ) {
        let checkDealer = true;
        dealerWork();

        let dealer = getSummaryScores( hands[0] );
        let player = getSummaryScores( hands[1] );
        console.log(printCurrentState(hands, checkDealer));

        if ( dealer > 21 ) {
          console.log(green("You WIN!\n"));
          result = 'win';
        } else if ( dealer > player ) {
          console.log(red("You fail!\n"));
          result = 'fail';
        } else if (dealer < player) {
          console.log(green("You WIN!\n"));
          result = 'win';
        } else {
          console.log("Stay.\n");
          result = 'stay';
        }

        if (needLog) writeLog(result);
        hands = newRound();
    };

    return;

  }
);
