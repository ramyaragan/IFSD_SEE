const prompt = require('prompt-sync')();

class Party {
  constructor(name) {
    this.name = name;
    this.politicians = [];
  }

  addPolitician(politician) {
    this.politicians.push(politician);
  }
}

class Politician {
  static count = 1;

  constructor(party, votes, money) {
    this.id = Politician.count++;
    this.party = party;
    this.votes = votes;
    this.money = money;
  }
}

function main() {
  const parties = [];

  let numParties, numPoliticians;

  // Get the number of parties
  while (true) {
    numParties = parseInt(prompt('Enter the number of parties: '));

    if (Number.isNaN(numParties) || numParties < 1) {
      console.log('Invalid input. Number of parties should be a positive integer.');
    } else {
      break;
    }
  }

  // Get the number of politicians
  while (true) {
    numPoliticians = parseInt(prompt('Enter the number of politicians: '));

    if (Number.isNaN(numPoliticians) || numPoliticians < 1) {
      console.log('Invalid input. Number of politicians should be a positive integer.');
    } else {
      break;
    }
  }

  // Get party details
  for (let i = 0; i < numParties; i++) {
    console.log(`Party ${i + 1}:`);
    const partyName = prompt('Enter the party name: ');
    const party = new Party(partyName);
    parties.push(party);
    console.log('------------------');
  }

  // Get politician details
  for (let i = 0; i < numPoliticians; i++) {
    console.log(`Politician ${i + 1}:`);

    while (true) {
      const partyIndex = parseInt(prompt('Enter the party index: '));

      if (isNaN(partyIndex) || partyIndex < 1 || partyIndex > parties.length) {
        console.log('Invalid party index.');
      } else {
        const party = parties[partyIndex - 1];

        let votes, money;

        while (true) {
          votes = parseInt(prompt('Enter the number of votes: '));

          if (isNaN(votes) || votes < 0) {
            console.log('Invalid input. Votes should be a non-negative integer.');
          } else {
            break;
          }
        }

        while (true) {
          money = parseFloat(prompt('Enter the amount of money: '));

          if (isNaN(money) || money < 0) {
            console.log('Invalid input. Money should be a non-negative number.');
          } else {
            break;
          }
        }

        const politician = new Politician(party, votes, money);
        party.addPolitician(politician);
        console.log('------------------');
        break;
      }
    }
  }

  console.log('Parties and Politicians:');
  for (let party of parties) {
    console.log(`Party: ${party.name}`);

    for (let politician of party.politicians) {
      console.log(`ID: ${politician.id}`);
      console.log(`Votes: ${politician.votes}`);
      console.log(`Money: ${politician.money}`);
      console.log('------------------');
    }
  }

  // Find politician with maximum votes and maximum money
  const maxVotesPolitician = findPoliticianWithMaxVotes(parties);
  const maxMoneyPolitician = findPoliticianWithMaxMoney(parties);

  console.log('Politician with Maximum Votes:');
  console.log(`ID: ${maxVotesPolitician.id}`);
  console.log(`Votes: ${maxVotesPolitician.votes}`);
  console.log('------------------');
  
  console.log('Politician with Maximum Money:');
  console.log(`ID: ${maxMoneyPolitician.id}`);
  console.log(`Money: ${maxMoneyPolitician.money}`);
  console.log('------------------');
}

function findPoliticianWithMaxVotes(parties) {
  let maxVotesPolitician = null;
  let maxVotes = -1;

  for (let party of parties) {
    for (let politician of party.politicians) {
      if (politician.votes > maxVotes) {
        maxVotes = politician.votes;
        maxVotesPolitician = politician;
      }
    }
  }

  return maxVotesPolitician;
}

function findPoliticianWithMaxMoney(parties) {
  let maxMoneyPolitician = null;
  let maxMoney = -1;

  for (let party of parties) {
    for (let politician of party.politicians) {
      if (politician.money > maxMoney) {
        maxMoney = politician.money;
        maxMoneyPolitician = politician;
      }
    }
  }

  return maxMoneyPolitician;
}

main();
