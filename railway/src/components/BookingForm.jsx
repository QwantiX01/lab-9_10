import { useState } from "react";
import styles from "./BookingForm.module.css";

const PHONE_RE = /^(\+?38)?0\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, phone, email }) {
  const errors = {};
  if (!name.trim() || name.trim().length < 2)
    errors.name = "Введіть ім'я (мін. 2 символи)";
  if (!PHONE_RE.test(phone.replace(/[\s\-()]/g, "")))
    errors.phone = "Невірний формат телефону (напр. 0671234567)";
  if (!EMAIL_RE.test(email.trim())) errors.email = "Невірний формат email";
  return errors;
}

export default function BookingForm({ selectedSeats, onSubmit, disabled }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true });
    if (Object.keys(errs).length > 0) return;
    onSubmit(form);
    setForm({ name: "", phone: "", email: "" });
    setTouched({});
    setErrors({});
  }

  const noSeats = selectedSeats.length === 0;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Оформлення квитка</h2>

      {noSeats && (
        <p className={styles.hint}>Спочатку оберіть місця на схемі вагону</p>
      )}

      {!noSeats && (
        <p className={styles.seatsInfo}>
          Місця:{" "}
          <span className={styles.seatsList}>
            {selectedSeats.sort((a, b) => a - b).join(", ")}
          </span>
        </p>
      )}

      <Field
        label="Ім'я та прізвище"
        name="name"
        type="text"
        placeholder="Іваненко Іван"
        value={form.name}
        error={errors.name}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        label="Телефон"
        name="phone"
        type="tel"
        placeholder="0671234567"
        value={form.phone}
        error={errors.phone}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="ivano@example.com"
        value={form.email}
        error={errors.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <button
        type="submit"
        className={styles.btn}
        disabled={disabled || noSeats}
      >
        {disabled ? "Бронювання..." : "Забронювати"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  onChange,
  onBlur,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        autoComplete="off"
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
