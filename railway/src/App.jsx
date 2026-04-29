import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookingProvider } from "./context/BookingContext";
import Home from "./pages/Home";
import Booking from "./pages/Booking";

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:trainId" element={<Booking />} />
        </Routes>
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastStyle={{
            background: "#1a1a2e",
            border: "1px solid #2a2a4a",
            color: "#f0f0f8",
          }}
        />
      </BookingProvider>
    </BrowserRouter>
  );
}
