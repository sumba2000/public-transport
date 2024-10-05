adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Simple authentication (for demonstration purposes)
    if (username === 'admin' && password === 'password') {
        adminLoginDiv.style.display = 'none';
        adminBookingsDiv.style.display = 'block';
        await displayBookings();
    } else {
        alert('Invalid username or password');
    }
});

// Handle logout
logoutButton.addEventListener('click', () => {
    adminLoginDiv.style.display = 'block';
    adminBookingsDiv.style.display = 'none';
});

function updateBookedSeats(bus) {
    bookedSeatsList.innerHTML = '';
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings = bookings.filter(booking => booking.bus === bus.name);
    bookings.forEach(booking => {
        const seatItem = document.createElement('li');
        seatItem.textContent = `Seat ${booking.seat} - ${booking.name}`;
        bookedSeatsList.appendChild(seatItem);
    });
}

async function displayBookings() {
    adminBookingsList.innerHTML = '';
    try {
        const response = await fetch('http://localhost:3000/bookings');
        const bookings = await response.json();
        bookings.forEach(booking => {
            const bookingItem = document.createElement('li');
            bookingItem.textContent = `Route: ${booking.route}, Bus: ${booking.bus}, Seat: ${booking.seat}, Name: ${booking.name}, Mobile: ${booking.mobile}, Pick-Up: ${booking.pickup}, Drop-Off: ${booking.drop}`;
            adminBookingsList.appendChild(bookingItem);
        });
    } catch (error) {
        alert('Error: ' + error.message);
    }
}
});