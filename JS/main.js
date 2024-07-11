document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const numberOfDice = parseInt(document.getElementById('dice').value, 10);
        console.log(numberOfDice);
    });
});