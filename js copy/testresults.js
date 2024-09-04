document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const resultContainer = document.getElementById('resultContainer');
    const patientNameInput = document.getElementById('patientName');

    // Simulate database of results
    const results = [
        { name: 'john doe', test: 'Blood Test', result: 'Normal' },
        { name: 'jane smith', test: 'X-Ray', result: 'No issues detected' },
        // Add more results as needed
    ];

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = patientNameInput.value.trim().toLowerCase();
        resultContainer.innerHTML = ''; // Clear previous results

        if (name) {
            const filteredResults = results.filter(result => result.name === name);

            if (filteredResults.length > 0) {
                filteredResults.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.classList.add('result');
                    resultElement.innerHTML = `<h3>${result.test}</h3><p>${result.result}</p>`;
                    resultContainer.appendChild(resultElement);
                });
            } else {
                resultContainer.innerHTML = '<p>No results found.</p>';
            }
        }
    });
});
