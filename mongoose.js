const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ramyarnbsc22:U01cXsvP21QZSZdo@cluster10.slez8ck.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Party schema
const partySchema = new mongoose.Schema({
  name: String
});

// Define the Politician schema
const politicianSchema = new mongoose.Schema({
  partyId: mongoose.Schema.Types.ObjectId,
  votes: Number,
  money: Number
});

// Create the Party model
const Party = mongoose.model('Party', partySchema);

// Create the Politician model
const Politician = mongoose.model('Politician', politicianSchema);

async function main() {
  try {
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
      const party = new Party({ name: partyName });
      await party.save();
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
          await createPolitician(parties);
          break;
        case 2:
          await retrievePoliticians();
          break;
        case 3:
          await updatePolitician(parties);
          break;
        case 4:
          await deletePolitician();
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
    mongoose.connection.close();
  }
}

async function createPolitician(parties) {
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

  const politician = new Politician({ partyId: party._id, votes, money });
  await politician.save();
  console.log('Politician added successfully.');
}

async function retrievePoliticians() {
  console.log('------------------');
  const politicians = await Politician.aggregate([
    { $lookup: { from: 'parties', localField: 'partyId', foreignField: '_id', as: 'party' } },
    { $unwind: '$party' },
    { $project: { partyName: '$party.name', politician: '$$ROOT' } },
  ]);

  if (politicians.length === 0) {
    console.log('No politicians found.');
    return;
  }

  console.log('Politicians:');
  for (let politician of politicians) {
    console.log(`Party: ${politician.partyName}`);
    console.log(`ID: ${politician.politician._id}`);
    console.log(`Votes: ${politician.politician.votes}`);
    console.log(`Money: ${politician.politician.money}`);
    console.log('------------------');
  }
}

async function updatePolitician(parties) {
  console.log('------------------');
  const politicianId = prompt('Enter the politician ID: ');

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

  await Politician.updateOne(
    { _id: politicianId },
    { $set: { partyId: party._id, votes, money } }
  );
  console.log('Politician updated successfully.');
}

async function deletePolitician() {
  console.log('------------------');
  const politicianId = prompt('Enter the politician ID: ');

  await Politician.deleteOne({ _id: politicianId });
  console.log('Politician deleted successfully.');
}

main();
