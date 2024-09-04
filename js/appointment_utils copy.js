document.addEventListener('DOMContentLoaded', async function () {
    const doctorSelect = document.getElementById('doctor-select');
    const appointmentDateInput = document.getElementById('appointment-date');

    // Asynchronously load doctors into the select dropdown
    try {
        const doctors = await loadDoctors();  // Assuming loadDoctors() returns an array of doctor objects
        console.log(doctors);
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctorID;
            option.textContent = `${doctor.specialization} - ${doctor.doctorID}`;
            doctorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load doctors:', error);
        alert('Could not load doctor data. Please refresh the page to try again.');
    }

    // Initialize FullCalendar
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        events: fetchAppointmentsForSelectedDoctor,
        dateClick: function(info) {
            appointmentDateInput.value = info.dateStr; // Set the date input to the clicked date
        }
    });
    calendar.render();

    // Event listener for when a doctor is selected to refresh calendar data
    doctorSelect.addEventListener('change', function () {
        calendar.refetchEvents();
    });

    // Form submission handling
    document.querySelector('form').onsubmit = async function(event) {
        event.preventDefault();
        try {
            await submitAppointment();
        } catch (error) {
            console.error('Error submitting appointment:', error);
            alert('Error booking appointment. Please try again.');
        }
    };
});

export async function loadDoctors() {
    console.log("Fetching doctors");
    try {
        const response = await fetch('https://trxd5g8l23.execute-api.eu-north-1.amazonaws.com/dev/doctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'V3ymk8iT375ms5uVBhYuA21kZohQtUTH9SpZrIz3' // Assume an API key is required
            }
        });

        console.log(response)

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const doctors = await response.json();
        console.log('Loaded doctors:', doctors);
        return doctors;
    } catch (error) {
        console.error('Error fetching doctors:', error);
        // Optionally, handle the UI feedback about the failure
        return []; // Return an empty array or appropriate fallback to handle failures gracefully
    }

}

export async function fetchAppointmentsForSelectedDoctor(doctorId, successCallback, failureCallback) {
    console.log("Fetching appointments for doctor ID:", JSON.stringify(doctorId));
    try {
        const response = await fetch(`https://trxd5g8l23.execute-api.eu-north-1.amazonaws.com/dev/appointments?doctorId=${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const appointments = await response.json();
        const events = appointments.map(appointment => ({
            title: "Booked",
            start: appointment.date // Ensure date format aligns with FullCalendar expectations
        }));

        successCallback(events);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        failureCallback(error);
    }
}

export async function submitAppointment() {
    console.log("Submitting new appointment");
    const formData = new FormData(document.querySelector('form'));
    const data = {
        firstName: formData.get('first_name'),
        lastName: formData.get('last_name'),
        phone: formData.get('phone_number'),
        email: formData.get('email'),
        service: formData.get('service'),
        doctorId: document.getElementById('doctor-select').value,
        date: document.getElementById('appointment-date').value
    };

    console.log("Submitting new appointment", data)

    try {
        const response = await fetch('https://trxd5g8l23.execute-api.eu-north-1.amazonaws.com/dev/appointments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error(`Failed to create appointment with status: ${response.status}`);

        const result = await response.json();
        console.log('Appointment created:', result);
        alert('Appointment successfully booked!');
        // Assume you have a reference to your calendar object
        calendar.refetchEvents(); // Refresh the calendar to show the new appointment
    } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Error booking appointment. Please try again.');
    }
}
