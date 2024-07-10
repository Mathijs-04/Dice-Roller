document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultsDiv = document.querySelector('.results');
    const successParagraph = resultsDiv.querySelector('p:first-of-type');
    const throwResultsDiv = document.querySelector('.throwResults');
    const rollAgainButton = document.querySelector('button');

    let lastSuccessRolls = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        rollDice();
    });

    rollAgainButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (lastSuccessRolls.length > 0) {
            rollDice(lastSuccessRolls.length, true);
        }
    });

    function rollDice(numberOfDice = null, isReroll = false) {
        const diceCount = numberOfDice || parseInt(document.getElementById('dice').value, 10);
        const numberOfSides = parseInt(document.getElementById('sides').value, 10);
        const successCondition = document.querySelector('input[name="succes"]:checked').value;
        const successValue = parseInt(document.getElementById('succes').value, 10);

        if (isNaN(diceCount) || isNaN(numberOfSides) || isNaN(successValue)) {
            alert('Please fill in all the fields correctly.');
            return;
        }

        let successCount = 0;
        const sideCounts = Array(numberOfSides).fill(0);
        lastSuccessRolls = [];

        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * numberOfSides) + 1;
            sideCounts[roll - 1]++;

            if ((successCondition === 'higher' && roll >= successValue) ||
                (successCondition === 'lower' && roll <= successValue) ||
                (successCondition === 'only' && roll === successValue)) {
                successCount++;
                if (isReroll) lastSuccessRolls.push(roll);
            }
        }

        if (!isReroll) {
            successParagraph.textContent = `${successCount} successful rolls`;
            updateThrowResults(sideCounts);
        }
    }

    function updateThrowResults(sideCounts) {
        throwResultsDiv.innerHTML = '';
        sideCounts.forEach((count, index) => {
            const resultElement = document.createElement('p');
            resultElement.textContent = `Side ${index + 1}: ${count} times`;
            throwResultsDiv.appendChild(resultElement);
        });
    }
});