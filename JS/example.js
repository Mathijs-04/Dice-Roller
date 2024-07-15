document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultsDiv = document.querySelector('.results');
    const successParagraph = resultsDiv.querySelector('p:first-of-type');
    const throwResultsDiv = document.querySelector('.throwResults');
    const warningText = document.createElement('p');
    const radioButtonsContainer = document.querySelector('.radioButtons');

    warningText.className = 'errorMessage';
    resultsDiv.style.display = 'none';

    radioButtonsContainer.insertAdjacentElement('afterend', warningText);
    let lastSuccessRolls = [];
    let hasRolledOnce = false;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        warningText.textContent = '';
        const diceCount = parseInt(document.getElementById('dice').value, 10);
        const numberOfSides = parseInt(document.getElementById('sides').value, 10);
        const successConditionElement = document.querySelector('input[name="succes"]:checked');
        const successValue = parseInt(document.getElementById('succes').value, 10);

        if (diceCount < 0 || numberOfSides < 0 || successValue < 0) {
            warningText.textContent = 'Numbers cannot be negative.';
            return;
        }

        if (isNaN(diceCount) || isNaN(numberOfSides) || isNaN(successValue) || !successConditionElement) {
            warningText.textContent = 'Please fill all the fields correctly';
            return;
        }

        const successCondition = successConditionElement.value;

        if (!hasRolledOnce) {
            resultsDiv.style.display = 'block';
            hasRolledOnce = true;
        }

        rollDice(diceCount);
    });

    function rollDice(numberOfDice) {
        const numberOfSides = parseInt(document.getElementById('sides').value, 10);
        const successCondition = document.querySelector('input[name="succes"]:checked').value;
        const successValue = parseInt(document.getElementById('succes').value, 10);

        let successCount = 0;
        const sideCounts = Array(numberOfSides).fill(0);
        lastSuccessRolls = [];

        for (let i = 0; i < numberOfDice; i++) {
            const roll = Math.floor(Math.random() * numberOfSides) + 1;
            sideCounts[roll - 1]++;

            if ((successCondition === 'higher' && roll >= successValue) ||
                (successCondition === 'lower' && roll <= successValue) ||
                (successCondition === 'only' && roll === successValue)) {
                successCount++;
                lastSuccessRolls.push(roll);
            }
        }

        successParagraph.textContent = `${successCount} successful rolls`;
        updateThrowResults(sideCounts);
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