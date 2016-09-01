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

const dealNewCards = () => {
  return deck.deal(2, 2);
}

const newRound = (hands) => {
  console.log("\n- - - New round - - -\n");
  hands = dealNewCards();
  console.log(printCurrentState(hands));
  console.log("Choose action: deal|d  check|c  exit|e");
  return hands;
}

const dealerWork = () => {
  while ( getSummaryScores(hands[0]) < 17 ) {
    hands[0].push(deck.draw());
  }
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

let hands = newRound();

rl.on('line', function(cmd) {

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
          console.log("You fail!");
          hands = newRound();
        }
        return;
    };

    if ( inarray(check, cmd) ) {
        let checkDealer = true;
        dealerWork();

        let dealer = getSummaryScores( hands[0] );
        let player = getSummaryScores( hands[1] );
        console.log(printCurrentState(hands, checkDealer));

        if ( dealer > 21 ) {
          console.log("You WIN!\n");
        } else if ( dealer > player ) {
          console.log("You fail!\n");
        } else if (dealer < player) {
          console.log("You WIN!\n");
        } else {
          console.log("Stay.\n");
        }

        hands = newRound();

        return;
    };

  }
);
