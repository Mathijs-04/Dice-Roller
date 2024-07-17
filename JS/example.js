document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const resultsDiv = document.querySelector('.results');
    const successParagraph = resultsDiv.querySelector('p:first-of-type');
    const throwResultsDiv = document.querySelector('.throwResults');
    const warningText = document.createElement('p');
    const radioButtonsContainer = document.querySelector('.radioButtons');
    const sidesInput = document.getElementById('sides');
    const parchment = document.querySelector('.parchment');
    const seal = document.querySelector('.seal');

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

        if (diceCount > 10000) {
            warningText.textContent = 'Number of Dice cannot exceed 10000';
            return;
        }

        if (numberOfSides > 100) {
            warningText.textContent = 'Number of Sides cannot exceed 100';
            return;
        }

        if (successValue > numberOfSides) {
            warningText.textContent = 'Successful roll exceeds number of sides.';
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

        const baseHeight = 55;
        const additionalHeightPerSide = 2.75;
        const newHeight = baseHeight + (numberOfSides * additionalHeightPerSide);
        parchment.style.height = `${newHeight}rem`;

        const sealMarginTopBase = 39;
        const sealAdditionalMarginPerSide = 2.75;
        const newSealMarginTop = sealMarginTopBase + (numberOfSides * sealAdditionalMarginPerSide);
        seal.style.marginTop = `${newSealMarginTop}rem`;

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
        let currentRow;
        let counter = 0;

        sideCounts.forEach((count, index) => {
            if (counter % 5 === 0) {
                currentRow = document.createElement('div');
                currentRow.className = 'resultsRow';
            }

            const resultElement = document.createElement('p');
            resultElement.textContent = `Side ${index + 1}: ${count} times`;
            currentRow.appendChild(resultElement);

            counter++;

            if (counter % 5 === 0 || index === sideCounts.length - 1) {
                throwResultsDiv.appendChild(currentRow);
            }
        });
    }
});