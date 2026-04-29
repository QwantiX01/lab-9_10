const STORAGE_KEY = "railway_bookings";

function getAllBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/**
 * Зберігає нове бронювання.
 * @param {{ trainId: string, wagonId: string, seats: number[], person: { name: string, phone: string, email: string } }} booking
 * @returns {{ id: string, createdAt: string } & typeof booking}
 */
export function saveBooking({ trainId, wagonId, seats, person }) {
  const bookings = getAllBookings();
  const entry = {
    id: crypto.randomUUID(),
    trainId,
    wagonId,
    seats,
    person,
    createdAt: new Date().toISOString(),
  };
  bookings.push(entry);
  saveAllBookings(bookings);
  return entry;
}

/**
 * Повертає масив зарезервованих номерів місць для конкретного вагона.
 * @param {string} trainId
 * @param {string} wagonId
 * @returns {number[]}
 */
export function getBookedSeats(trainId, wagonId) {
  const bookings = getAllBookings();
  return bookings
    .filter((b) => b.trainId === trainId && b.wagonId === wagonId)
    .flatMap((b) => b.seats);
}
