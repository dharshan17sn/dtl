// Fetch all complaints
async function fetchComplaints() {
    try {
        const response = await fetch('/admin-complaints');
        const complaints = await response.json();
        const tableBody = document.getElementById('complaintsTable');
        tableBody.innerHTML = '';

        complaints.forEach(complaint => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${complaint._id}</td>
                <td>${complaint.name}</td>
                <td>${complaint.email}</td>
                <td>${complaint.mobile}</td>
                <td>${complaint.busNumber}</td>
                <td>${complaint.complaintType}</td>
                <td>${complaint.complaintDescription}</td>
                <td>${complaint.complaintPhoto ? `<a href="${complaint.complaintPhoto}" target="_blank">View</a>` : 'N/A'}</td>
                <td>${complaint.status}</td>
                <td>
                    <button class="update" onclick="updateStatus('${complaint._id}', 'Resolved')">Resolve</button>
                    <button class="delete" onclick="updateStatus('${complaint._id}', 'Rejected')">Reject</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching complaints:", error);
    }
}

// Update complaint status
async function updateStatus(complaintId, status) {
    try {
        const response = await fetch('/update-complaint-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ complaintId, status }),
        });

        const result = await response.json();
        alert(result.message);
        fetchComplaints(); // Refresh complaints
    } catch (error) {
        console.error("Error updating complaint status:", error);
        alert("Failed to update complaint status.");
    }
}

// Fetch complaints on page load
document.addEventListener('DOMContentLoaded', fetchComplaints);
