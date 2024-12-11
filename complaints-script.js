document.getElementById('complaintForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Check if required fields are filled
    let isValid = true;
    event.target.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!field.value) {
            isValid = false;
            field.style.border = "2px solid red"; // Add red border to invalid fields
        } else {
            field.style.border = ""; // Remove the red border if the field is valid
        }
    });

    if (!isValid) {
        alert('Please fill out all required fields.');
        return; // Stop form submission if validation fails
    }

    try {
        const response = await fetch('/submit-complaint', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error submitting complaint:", error);
        alert("Failed to submit complaint.");
    }
});

document.getElementById('statusForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('query').value;

    try {
        const response = await fetch(`/complaint-status?query=${encodeURIComponent(query)}`);
        const result = await response.json();
        const statusMessage = result.status
            ? `Complaint Status: ${result.status}`
            : 'No complaint found.';
        document.getElementById('statusResult').innerText = statusMessage;
    } catch (error) {
        console.error("Error checking status:", error);
        alert("Failed to fetch complaint status.");
    }
});
