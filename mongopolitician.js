const prompt = require('prompt-sync')();
const { MongoClient, ObjectId } = require('mongodb');

class Party {
  constructor(name) {
    this.name = name;
  }
}

class Politician {
  static count = 1;

  constructor(partyId, votes, money) {
    this.id = Politician.count++;
    this.partyId = partyId;
    this.votes = votes;
    this.money = money;
  }
}

async function main() {
  const uri = 'mongodb+srv://ramyarnbsc22:U01cXsvP21QZSZdo@cluster10.slez8ck.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('your-db-name');
    const partiesCollection = database.collection('parties');

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
    const parties = [];
    for (let i = 0; i < numParties; i++) {
      console.log(`Party ${i + 1}:`);
      const partyName = prompt('Enter the party name: ');
      const party = new Party(partyName);
      await partiesCollection.insertOne(party);
      parties.push(party);
      console.log('Party added successfully.');
      console.log('------------------');
    }

    let choice = 0;
    while (choice !== 5) {
      console.log('------------------');
      console.log('1. Create a politician');
      console.log('2. Retrieve all politicians');
      console.log('3. Update a politician');
      console.log('4. Delete a politician');
      console.log('5. Exit');
      console.log('------------------');
      choice = parseInt(prompt('Enter your choice: '));

      switch (choice) {
        case 1:
          await createPolitician(parties, partiesCollection);
          break;
        case 2:
          await retrievePoliticians(partiesCollection);
          break;
        case 3:
          await updatePolitician(parties, partiesCollection);
          break;
        case 4:
          await deletePolitician(parties, partiesCollection);
          break;
        case 5:
          console.log('Exiting...');
          break;
        default:
          console.log('Invalid choice. Please try again.');
          break;
      }
    }

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    client.close();
  }
}

async function createPolitician(parties, partiesCollection) {
  console.log('------------------');
  const partyIndex = parseInt(prompt('Enter the party index: '));

  if (isNaN(partyIndex) || partyIndex < 1 || partyIndex > parties.length) {
    console.log('Invalid party index.');
    return;
  }

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

  const politician = new Politician(partyIndex, votes, money);
  await partiesCollection.updateOne(
    { _id: party._id },
    { $push: { politicians: politician } }
  );
  console.log('Politician added successfully.');
}

async function retrievePoliticians(partiesCollection) {
  console.log('------------------');
  const politicians = await partiesCollection.aggregate([
    { $unwind: '$politicians' },
    { $project: { _id: 0, partyId: 1, politician: '$politicians' } },
    { $lookup: { from: 'parties', localField: 'partyId', foreignField: '_id', as: 'party' } },
    { $unwind: '$party' },
    { $project: { partyName: '$party.name', politician: 1 } },
  ]).toArray();

  if (politicians.length === 0) {
    console.log('No politicians found.');
    return;
  }

  console.log('Politicians:');
  for (let politician of politicians) {
    console.log(`Party: ${politician.partyName}`);
    console.log(`ID: ${politician.politician.id}`);
    console.log(`Votes: ${politician.politician.votes}`);
    console.log(`Money: ${politician.politician.money}`);
    console.log('------------------');
  }
}

async function updatePolitician(parties, partiesCollection) {
  console.log('------------------');
  const politicianId = parseInt(prompt('Enter the politician ID: '));

  const partyIndex = parseInt(prompt('Enter the party index: '));

  if (isNaN(partyIndex) || partyIndex < 1 || partyIndex > parties.length) {
    console.log('Invalid party index.');
    return;
  }

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

  const politician = new Politician(partyIndex, votes, money);
  await partiesCollection.updateOne(
    { politicians: { $elemMatch: { id: politicianId } } },
    { $set: { 'politicians.$': politician } }
  );
  console.log('Politician updated successfully.');
}

async function deletePolitician(parties, partiesCollection) {
  console.log('------------------');
  const politicianId = parseInt(prompt('Enter the politician ID: '));

  await partiesCollection.updateOne(
    {},
    { $pull: { politicians: { id: politicianId } } }
  );
  console.log('Politician deleted successfully.');
}

main();
