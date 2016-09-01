'use strict';
console.log('\x1Bc');

var cards = require('french-deck');
var readline = require('readline');
var inarray = require('inarray');

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


//Prepare for game
let exit = ['Exit', 'exit', 'e', 'E'];
let deal = ['Deal', 'deal', 'd', 'D'];
let check = ['Check', 'check', 'c', 'C'];
var deck = new cards.Deck({
    jokers: 0,
    decks: 1
});
deck.shuffle();
let gameResults;


let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let hands = deck.deal(2, 2);
rl.write(printCurrentState(hands));
rl.write("Choose action: deal|d  check|c  exit|e\n");

rl.on('line', function(cmd) {
    if ( inarray(exit, cmd) ) {
        this.close();
        return;
    };

    if ( inarray(deal, cmd) ) {
        hands[1].push(deck.draw());
        console.log(printCurrentState(hands));
        console.log("Choose action: deal|d  check|c  exit|e");
        return;
    };

    if ( inarray(check, cmd) ) {
        let checkDealer = true;
        console.log(printCurrentState(hands, checkDealer));
        return;
    };

  }
);


deck.reset();
