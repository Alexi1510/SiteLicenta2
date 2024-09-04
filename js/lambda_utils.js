const apiEndpoint = 'https://r1xak6mkl5.execute-api.eu-north-1.amazonaws.com/dev';

// Fetch items
async function fetchItems() {
    try {
        const response = await fetch(`${apiEndpoint}/items`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const items = await response.json();
        console.log(items);
        // Update UI with fetched items
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}



export async function postUserData(userData) {
    console.log("posting user")
    try {
        const response = await fetch('https://r1xak6mkl5.execute-api.eu-north-1.amazonaws.com/dev', {
            method: 'POST',
           

            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'V3ymk8iT375ms5uVBhYuA21kZohQtUTH9SpZrIz3'
            },
            body: JSON.stringify(userData)
        });
        
        print("!!!",response)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (response.ok) {
            console.log('Registration Success:', result);
        }
        return response
        // Optionally, handle further actions after successful registration
        // e.g., redirect the user to a login page or a success page
    } catch (error) {
        console.error('Error during registration:', error);
        // Optionally, provide user feedback on the UI about the failure
    }
}

