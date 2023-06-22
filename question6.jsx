import React, { useEffect } from 'react';

const PoliticalPartiesWidget = () => {
  useEffect(() => {
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

    const PoliticalPartiesWidgetComponent = () => {
      useEffect(() => {
        const parties = [];

        let numParties, numPoliticians;

        while (true) {
          numParties = parseInt(prompt('Enter the number of parties: '));

          if (Number.isNaN(numParties) || numParties < 1) {
            console.log('Invalid input. Number of parties should be a positive integer.');
          } else {
            break;
          }
        }

        while (true) {
          numPoliticians = parseInt(prompt('Enter the number of politicians: '));

          if (Number.isNaN(numPoliticians) || numPoliticians < 1) {
            console.log('Invalid input. Number of politicians should be a positive integer.');
          } else {
            break;
          }
        }

        for (let i = 0; i < numParties; i++) {
          console.log(`Party ${i + 1}:`);
          const partyName = prompt('Enter the party name: ');
          const party = new Party(partyName);
          parties.push(party);
          console.log('------------------');
        }

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

        const app = document.getElementById('app');

        for (let party of parties) {
          const partyDiv = document.createElement('div');
          partyDiv.className = 'party-item';

          const partyName = document.createElement('h2');
          partyName.className = 'party-name';
          partyName.textContent = `Party: ${party.name}`;

          partyDiv.appendChild(partyName);

          for (let politician of party.politicians) {
            const politicianDiv = document.createElement('div');
            politicianDiv.className = 'politician-item';

            const politicianId = document.createElement('p');
            politicianId.textContent = `ID: ${politician.id}`;

            const politicianVotes = document.createElement('p');
            politicianVotes.textContent = `Votes: ${politician.votes}`;

            const politicianMoney = document.createElement('p');
            politicianMoney.textContent = `Money: ${politician.money}`;

            politicianDiv.appendChild(politicianId);
            politicianDiv.appendChild(politicianVotes);
            politicianDiv.appendChild(politicianMoney);

            partyDiv.appendChild(politicianDiv);
          }

          app.appendChild(partyDiv);
        }

        const maxVotesPolitician = findPoliticianWithMaxVotes(parties);
        const maxMoneyPolitician = findPoliticianWithMaxMoney(parties);

        const maxVotesDiv = document.createElement('div');
        maxVotesDiv.className = 'max-votes';

        const maxVotesTitle = document.createElement('h2');
        maxVotesTitle.textContent = 'Politician with Maximum Votes:';

        const maxVotesId = document.createElement('p');
        maxVotesId.textContent = `ID: ${maxVotesPolitician.id}`;

        const maxVotesVotes = document.createElement('p');
        maxVotesVotes.textContent = `Votes: ${maxVotesPolitician.votes}`;

        maxVotesDiv.appendChild(maxVotesTitle);
        maxVotesDiv.appendChild(maxVotesId);
        maxVotesDiv.appendChild(maxVotesVotes);

        app.appendChild(maxVotesDiv);

        const maxMoneyDiv = document.createElement('div');
        maxMoneyDiv.className = 'max-money';

        const maxMoneyTitle = document.createElement('h2');
        maxMoneyTitle.textContent = 'Politician with Maximum Money:';

        const maxMoneyId = document.createElement('p');
        maxMoneyId.textContent = `ID: ${maxMoneyPolitician.id}`;

        const maxMoneyMoney = document.createElement('p');
        maxMoneyMoney.textContent = `Money: ${maxMoneyPolitician.money}`;

        maxMoneyDiv.appendChild(maxMoneyTitle);
        maxMoneyDiv.appendChild(maxMoneyId);
        maxMoneyDiv.appendChild(maxMoneyMoney);

        app.appendChild(maxMoneyDiv);
      }, []);

      return (
        <div className="container">
          <h1>Political Parties and Politicians</h1>
          <div id="app"></div>
        </div>
      );
    };

    PoliticalPartiesWidgetComponent();
  }, []);

  return null;
};

export default PoliticalPartiesWidget;
