document.addEventListener('DOMContentLoaded', () => {
    const routes = [
        // Your routes data here
    ];

    const routeSelect = document.getElementById('route');
    const busSelect = document.getElementById('bus');
    const seatSelect = document.getElementById('seat');
    const bookingForm = document.getElementById('booking-form');
    const paymentDiv = document.getElementById('payment');
    const busList = document.getElementById('bus-list');
    const changeBusForm = document.getElementById('change-bus-form');
    const cancelBookingForm = document.getElementById('cancel-booking-form');

    function populateRouteOptions() {
        routes.forEach(route => {
            const routeOption = document.createElement('option');
            routeOption.value = route.name;
            routeOption.textContent = route.name;
            routeSelect.appendChild(routeOption);
        });
    }

    function updateBusOptions() {
        const selectedRoute = routes.find(route => route.name === routeSelect.value);
        busSelect.innerHTML = '';
        busList.innerHTML = '';
        selectedRoute.buses.forEach(bus => {
            const busOption = document.createElement('option');
            busOption.value = bus.id;
            busOption.textContent = `${bus.name} - ${bus.availableSeats} out of 32 seats available - Departs at ${bus.departure} - Charge: KSh ${bus.charge}`;
            busSelect.appendChild(busOption);

            const busItem = document.createElement('div');
            busItem.textContent = `${bus.name} - ${bus.availableSeats} out of 32 seats available - Departs at ${bus.departure} - Charge: KSh ${bus.charge}`;
            busList.appendChild(busItem);
        });
    }

    function updateSeatOptions() {
        const selectedRoute = routes.find(route => route.name === routeSelect.value);
        const selectedBus = selectedRoute.buses.find(bus => bus.id == busSelect.value);
        seatSelect.innerHTML = '';
        for (let i = 1; i <= selectedBus.seats; i++) {
            const seatOption = document.createElement('option');
            seatOption.value = i;
            seatOption.textContent = `Seat ${i}`;
            seatSelect.appendChild(seatOption);
        }
    }

    function handleBooking(event) {
        event.preventDefault();
        const selectedRoute = routes.find(route => route.name === routeSelect.value);
        const selectedBus = selectedRoute.buses.find(bus => bus.id == busSelect.value);
        const selectedSeat = seatSelect.value;
        const passengerName = document.getElementById('name').value;
        const mobileNumber = document.getElementById('mobile').value;
        const pickupPoint = document.getElementById('pickup').value;
        const dropPoint = document.getElementById('drop').value;

        if (!passengerName || !mobileNumber || !pickupPoint || !dropPoint || !selectedSeat) {
            alert('Please fill in all fields.');
            return;
        }

        if (selectedBus.availableSeats > 0) {
            selectedBus.availableSeats--;
            const booking = {
                id: Date.now(), // Unique ID for each booking
                route: selectedRoute.name,
                bus: selectedBus.name,
                seat: selectedSeat,
                name: passengerName,
                mobile: mobileNumber,
                pickup: pickupPoint,
                drop: dropPoint
            };

            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            alert(`Booking confirmed! 
                   Route: ${selectedRoute.name}, 
                   Bus: ${selectedBus.name}, 
                   Seat: ${selectedSeat}, 
                   Name: ${passengerName}, 
                   Mobile: ${mobileNumber}, 
                   Pick-Up: ${pickupPoint}, 
                   Drop-Off: ${dropPoint}`);
            paymentDiv.textContent = `Please proceed to payment of KSh ${selectedBus.charge}`;
            updateBusOptions();
        } else {
            alert('Sorry, no available seats on this bus.');
        }
    }

    function handleBusChange(event) {
        event.preventDefault();
        const bookingId = document.getElementById('change-booking-id').value;
        const newBusId = document.getElementById('new-bus-id').value;

        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const booking = bookings.find(b => b.id == bookingId);
        if (!booking) {
            alert('Booking not found.');
            return;
        }

        const selectedRoute = routes.find(route => route.name === booking.route);
        const newBus = selectedRoute.buses.find(bus => bus.id == newBusId);
        if (newBus.availableSeats > 0) {
            newBus.availableSeats--;
            const oldBus = selectedRoute.buses.find(bus => bus.name === booking.bus);
            oldBus.availableSeats++;

            booking.bus = newBus.name;
            localStorage.setItem('bookings', JSON.stringify(bookings));

            alert(`Bus changed successfully to ${newBus.name}.`);
            updateBusOptions();
        } else {
            alert('Sorry, no available seats on the new bus.');
        }
    }

    function handleBookingCancel(event) {
        event.preventDefault();
        const bookingId = document.getElementById('cancel-booking-id').value;

        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const bookingIndex = bookings.findIndex(b => b.id == bookingId);
        if (bookingIndex === -1) {
            alert('Booking not found.');
            return;
        }

        const booking = bookings[bookingIndex];
        const selectedRoute = routes.find(route => route.name === booking.route);
        const bus = selectedRoute.buses.find(bus => bus.name === booking.bus);
        bus.availableSeats++;

        bookings.splice(bookingIndex, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        alert('Booking canceled successfully.');
        updateBusOptions();
    }

    routeSelect.addEventListener('change', updateBusOptions);
    busSelect.addEventListener('change', updateSeatOptions);
    bookingForm.addEventListener('submit', handleBooking);
    changeBusForm.addEventListener('submit', handleBusChange);
    cancelBookingForm.addEventListener('submit', handleBookingCancel);

    populateRouteOptions();
});
