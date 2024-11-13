import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookTickets.css';

const BookTickets = () => {
  const [formData, setFormData] = useState({ origin: '', destination: '', travelDate: '', passengers: 1 });
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState({});

  // Simulate fetching bus data
  useEffect(() => {
    const buses = [
      { id: 1, name: 'Express Bus 1', time: '10:00 AM', price: 100 },
      { id: 2, name: 'Express Bus 2', time: '02:00 PM', price: 120 },
      { id: 3, name: 'Express Bus 3', time: '06:00 PM', price: 150 },
    ];
    setAvailableBuses(buses);
    setSeatMap({
      1: { 1: false, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
      2: { 1: false, 2: false, 3: true, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
      3: { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 4) {
      const bookingData = { ...formData, selectedBus, selectedSeats };
      try {
        const response = await axios.post('http://localhost:3001/bookings', bookingData);
        if (response.status === 201) {
          setConfirmation(true);
        } else {
          alert('Booking failed!');
        }
      } catch (error) {
        console.error('Error booking tickets:', error);
        alert('There was an error with your booking.');
      }
    } else {
      // Handle step transitions
      if (step === 1) {
        setStep(2);
      } else if (step === 2 && selectedBus) {
        setStep(3);
      } else if (step === 3 && selectedSeats.length > 0) {
        setStep(4);
      } else {
        alert("Please fill all fields before proceeding.");
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSeatSelect = (seatNumber) => {
    if (!seatMap[selectedBus][seatNumber]) {
      setSelectedSeats((prev) =>
        prev.includes(seatNumber)
          ? prev.filter((seat) => seat !== seatNumber)
          : [...prev, seatNumber]
      );
    }
  };

  return (
    <div className="book-tickets-container">
      <h2>Book Your Tickets</h2>
      {confirmation ? (
        <div className="confirmation">
          <h3>Booking Confirmed!</h3>
          <p>Thank you for booking with us. A confirmation email has been sent to you.</p>
        </div>
      ) : (
        <form className="book-tickets-form" onSubmit={handleSubmit}>
          {/* Step 1: Trip Details */}
          {step === 1 && (
            <div className="step step-1 active">
              <h3>Enter Your Trip Details</h3>
              <label htmlFor="origin">Origin:</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Enter origin city"
                required
              />
              <label htmlFor="destination">Destination:</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter destination city"
                required
              />
              <label htmlFor="travelDate">Travel Date:</label>
              <input
                type="date"
                id="travelDate"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <label htmlFor="passengers">Passengers:</label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          )}

          {/* Step 2: Select Bus */}
          {step === 2 && (
            <div className="step step-2 active">
              <h3>Select a Bus</h3>
              <div className="bus-options">
                {availableBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className={`bus-option ${selectedBus === bus.id ? 'selected' : ''}`}
                    onClick={() => setSelectedBus(bus.id)}
                  >
                    <div className="bus-info">
                      <h4>{bus.name}</h4>
                      <p>{bus.time}</p>
                      <p className="price">${bus.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Seats */}
          {step === 3 && (
            <div className="step step-3 active">
              <h3>Select Your Seats</h3>
              <div className="seat-map">
                <div className="row">
                  {Object.keys(seatMap[selectedBus] || {}).map((seatNumber) => (
                    <button
                      key={seatNumber}
                      className={seatMap[selectedBus][seatNumber] ? 'occupied' : 'available'}
                      onClick={() => handleSeatSelect(seatNumber)}
                      disabled={seatMap[selectedBus][seatNumber]}
                    >
                      {seatNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {step < 4 ? (
            <>
              {step > 1 && (
                <button type="button" className="back-btn" onClick={handleBack}>
                  Back
                </button>
              )}
              <button type="submit" className="next-btn">Next</button>
            </>
          ) : (
            <>
              <button type="button" className="back-btn" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="confirm-btn">Confirm Booking</button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default BookTickets;
