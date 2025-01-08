document.addEventListener('DOMContentLoaded', () => {
    const startMatrixInputs = document.querySelectorAll('.start-matrix .cell');
    const finalMatrixInputs = document.querySelectorAll('.final-matrix .cell');
    
    function validateMatrix(inputs) {
        const values = Array.from(inputs).map(input => input.value).filter(value => value !== '');
        const uniqueValues = new Set(values);
        const isValid = values.length === uniqueValues.size && values.every(value => /^[1-8]$/.test(value));
        return isValid;
    }

    function handleInput(event) {
        const input = event.target;
        const startMatrixValid = validateMatrix(startMatrixInputs);
        const finalMatrixValid = validateMatrix(finalMatrixInputs);

        if (!startMatrixValid) {
            alert('Start Matrix must contain unique numbers from 1 to 8.');
            input.value = ''; // Clear the invalid input
        }

        if (!finalMatrixValid) {
            alert('Final Matrix must contain unique numbers from 1 to 8.');
            input.value = ''; // Clear the invalid input
        }
    }

    startMatrixInputs.forEach(input => input.addEventListener('input', handleInput));
    finalMatrixInputs.forEach(input => input.addEventListener('input', handleInput));


    const solveButton = document.querySelector("#solve-btn");

    solveButton.addEventListener('click', () => { 
        alert("Clicked");
    });
});

