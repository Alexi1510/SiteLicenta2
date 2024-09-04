// In appointment_utils.js
import { Calendar } from '@fullcalendar/core'; // Ensure proper import if using modules
 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';



document.addEventListener('DOMContentLoaded', function () {
    const doctorSelect = document.getElementById('doctor-select');
    const appointmentDateInput = document.getElementById('appointment-date');
    const calendarEl = document.getElementById('calendar');

    async function loadDoctors() {
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

    async function fetchAppointmentsForSelectedDoctor(fetchInfo, successCallback, failureCallback) {
        const doctorId = doctorSelect.value;
        const date = appointmentDateInput.value;
        if (doctorId && date) {  // Ensure both doctorId and date are selected
            console.log("Fetching appointments for doctor ID and date:", doctorId, date);
            try {
                const response = await fetch(`https://c97k7agsh2.execute-api.eu-north-1.amazonaws.com/dev/appointment?doctorID=${doctorId}&date=${date}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': 'V3ymk8iT375ms5uVBhYuA21kZohQtUTH9SpZrIz3'
                    }
                });
    
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
                const appointments = await response.json();
        
                const events = appointments.map(appointment => ({
                    title: appointment.title || "Booked", // Default title if not provided
                    start: appointment.startDateTime, // 'startDateTime' should be ISO string with date and time
                    end: appointment.endDateTime, // 'endDateTime' should also be ISO string with date and time
                    color: appointment.color || '#378006' // Optional, default color if not provided
                }));
    
                successCallback(events);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                failureCallback(error);
            }
        } else {
            console.log("Both doctor and date must be selected to fetch appointments.");
            successCallback([]); // Return an empty array to clear any existing appointments
        }
    }
    async function fetchAllAppointments(fetchInfo, successCallback, failureCallback) {
        // console.log("Fetching all appointments");
        try {
            const response = await fetch(`https://c97k7agsh2.execute-api.eu-north-1.amazonaws.com/dev/appointment`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'V3ymk8iT375ms5uVBhYuA21kZohQtUTH9SpZrIz3' // API key assumed necessary
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const appointments = await response.json();
            const events = appointments.map(appointment => ({
                title: appointment.title || "Booked", // Default title if not provided
                start: appointment.startDateTime, // 'startDateTime' should be ISO string with date and time
                end: appointment.endDateTime, // 'endDateTime' should also be ISO string with date and time
                color: appointment.color || '#378006' // Optional, default color if not provided
            }));
    
            successCallback(events);
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            failureCallback(error);
        }
    }

    // Helper function to combine date and time inputs into an ISO string
    function combineDateTime(date, time) {
        // Ensure the time includes seconds for full ISO format, defaulting to zero seconds
        const dateTime = new Date(`${date}T${time}:00`);
        return dateTime.toISOString();
    }

    async function submitAppointment() {
        const formData = new FormData(document.querySelector('form'));
        const data = {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            phone: formData.get('phone_number'),
            email: formData.get('email'),
            title: formData.get('service'),
            doctorID: document.getElementById('doctor-select').value,
            patientID: formData.get('email'),
            date : formData.get('appointment_date'),
            startDateTime: combineDateTime(formData.get('appointment_date'), formData.get('start_time')),
            endDateTime: combineDateTime(formData.get('appointment_date'), formData.get('end_time'))
        };
    
        console.log("Submitting new appointment", JSON.stringify(data));
    
        try {
            const response = await fetch('https://c97k7agsh2.execute-api.eu-north-1.amazonaws.com/dev/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) throw new Error(`Failed to create appointment with status: ${response.status}`);
    
            const result = await response.json();
            console.log('Appointment created:', result);
            alert('Appointment successfully booked!');
            calendar.refetchEvents(); 
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Error booking appointment. Please try again.');
        }
    }
    

  

    // Load doctors to populate the dropdown
    loadDoctors().then(doctors => {
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctorID;
            option.textContent = `${doctor.specialization} - ${doctor.doctorID}`;
            doctorSelect.appendChild(option);
        });
    }).catch(error => {
        console.error('Failed to load doctors:', error);
        alert('Could not load doctor data. Please refresh the page to try again.');
    });

    var calendar = new FullCalendar.Calendar(calendarEl, {
       
       
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay' // user can switch between the two
        },

        events: function(fetchInfo, successCallback, failureCallback) {
            const doctorId = doctorSelect.value;
            const date = appointmentDateInput.value;
    
            if (doctorId && date) {
                // Fetch appointments for selected doctor and date
                fetchAppointmentsForSelectedDoctor(fetchInfo, successCallback, failureCallback);
            } else {
                // Fetch all appointments if no doctor or date is selected
                fetchAllAppointments(fetchInfo, successCallback, failureCallback);
            }
        },
        dateClick: function(info) {
            const appointmentDateInput = document.getElementById('appointment-date');
            const startTimeInput = document.getElementById('start_time');
            const endTimeInput = document.getElementById('end_time');
        
            if (appointmentDateInput && startTimeInput && endTimeInput) {
                // Using ISO format directly to get the date in "yyyy-MM-dd" format
                let isoDate = info.date.toISOString().split('T')[0];
        
                // Format the local time to 24-hour format without seconds
                let localTime = info.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
                // Sets the values directly in the input fields
                appointmentDateInput.value = isoDate;
                document.getElementById('start_time').value = localTime = localTime;
        
                // Calculate end time by adding duration (e.g., 1 hour)
                let endTime = new Date(info.date);
                endTime.setHours(endTime.getHours() + 1);
                let localEndTime = endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                document.getElementById('end_time').value  = localEndTime;
        
                console.log("Date selected: ", isoDate);
                console.log("Start Time selected: ", document.getElementById('start_time').value = localTime);
                console.log("End Time selected: ", document.getElementById('end_time').value);
        
                // Refetch events whenever a new date is clicked
                calendar.refetchEvents();
            } else {
                console.error('Appointment date or time input element not found');
            }
        }
    });
    
    calendar.render();
    

   

  
    doctorSelect.addEventListener('change', function () {
        calendar.refetchEvents();
    });
    
    appointmentDateInput.addEventListener('change', function () {
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
