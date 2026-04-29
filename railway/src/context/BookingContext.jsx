import { createContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedWagonId, setSelectedWagonId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  function selectWagon(wagonId) {
    setSelectedWagonId(wagonId);
    setSelectedSeats([]);
  }

  function toggleSeat(seatNum) {
    setSelectedSeats((prev) =>
      prev.includes(seatNum)
        ? prev.filter((s) => s !== seatNum)
        : [...prev, seatNum],
    );
  }

  function clearSelection() {
    setSelectedWagonId(null);
    setSelectedSeats([]);
  }

  return (
    <BookingContext.Provider
      value={{
        selectedWagonId,
        selectedSeats,
        selectWagon,
        toggleSeat,
        clearSelection,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
