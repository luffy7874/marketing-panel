import React, { useState } from "react";
import { getYear, getMonth } from "date-fns";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { BiCaretDown } from "react-icons/bi";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface CustomHeaderProps {
  date: Date;
  monthDate: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

export const CustomDatePickerHeader: React.FC<CustomHeaderProps> = ({
  date,
  monthDate,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [yearWindowStart, setYearWindowStart] = useState(getYear(new Date()) - 5);

  const displayDate = monthDate || date;
  const currentYear = getYear(displayDate);
  const currentMonth = getMonth(displayDate);
  
  // --- LIMITS ---
  const today = new Date();
  const maxYear = getYear(today);
  const maxMonth = getMonth(today);

  // --- HANDLERS ---
  const handleMonthClick = (monthIndex: number) => {
    changeMonth(monthIndex);
    setView("day");
  };

  const handleYearClick = (year: number) => {
    changeYear(year);
    setView("day");
  };

  const shiftYearWindow = (amount: number) => {
    setYearWindowStart(yearWindowStart + amount);
  };

  // --- OVERLAY STYLE ---
  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "290px",
    backgroundColor: "white",
    zIndex: 100,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
  };

  // 1. Month Grid View
  if (view === "month") {
    return (
      <div style={overlayStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
           <span className="fw-bold ps-1">Select Month</span>
           <button className="btn btn-sm btn-light rounded-circle" onClick={() => setView("day")} style={{width: 30, height: 30}}>
             <FaTimes size={12} />
           </button>
        </div>
        <div className="row g-2">
          {months.map((m, i) => {
            // Disable future months if we are in the current year
            const isFutureMonth = currentYear === maxYear && i > maxMonth;
            
            return (
                <div className="col-4" key={m}>
                  <button
                    className={`btn btn-sm w-100 ${i === currentMonth ? "btn-primary" : "btn-outline-light text-dark border-secondary-subtle"}`}
                    onClick={() => handleMonthClick(i)}
                    disabled={isFutureMonth} // <--- DISABLE LOGIC
                    style={{ height: "40px", opacity: isFutureMonth ? 0.5 : 1 }} 
                  >
                    {m}
                  </button>
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Year Grid View
  if (view === "year") {
    const years = Array.from({ length: 12 }, (_, i) => yearWindowStart + i);
    
    // Check if the current window contains the max year to disable the "Next" arrow
    const isNextWindowFuture = years[years.length - 1] >= maxYear;

    return (
      <div style={overlayStyle}>
         <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
           <button className="btn btn-sm btn-light rounded-circle border" onClick={() => shiftYearWindow(-12)} style={{width: 30, height: 30}}>
             <FaChevronLeft size={10} />
           </button>
           <span className="fw-bold">
             {years[0]} - {years[years.length - 1]}
           </span>
           <div className="d-flex gap-1">
            <button 
                className="btn btn-sm btn-light rounded-circle border" 
                onClick={() => shiftYearWindow(12)} 
                disabled={isNextWindowFuture} // <--- DISABLE NEXT ARROW
                style={{width: 30, height: 30}}
            >
              <FaChevronRight size={10} />
            </button>
            <button className="btn btn-sm btn-light rounded-circle border ms-2" onClick={() => setView("day")} style={{width: 30, height: 30}}>
              <FaTimes size={10} />
              </button>
           </div>
        </div>
        <div className="row g-2">
          {years.map((y) => {
            const isFutureYear = y > maxYear; // <--- CHECK FUTURE YEAR

            return (
                <div className="col-4" key={y}>
                  <button
                    className={`btn btn-sm w-100 ${y === currentYear ? "btn-primary" : "btn-outline-light text-dark border-secondary-subtle"}`}
                    onClick={() => handleYearClick(y)}
                    disabled={isFutureYear} // <--- DISABLE BUTTON
                    style={{ height: "40px", opacity: isFutureYear ? 0.5 : 1 }}
                  >
                    {y}
                  </button>
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Default Header
  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom">
      <button
        className="header-arrow-prev btn btn-sm btn-light rounded-circle border d-flex align-items-center justify-content-center"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        style={{ width: "32px", height: "32px" }} 
        type="button"
      >
        <FaChevronLeft size={10} />
      </button>

      <div className="d-flex align-items-center gap-1">
        <button 
            className="btn btn-sm fw-bold text-dark bg-transparent border-0 px-2 py-1 hover-bg-light rounded"
            onClick={() => setView("month")}
        >
            {months[currentMonth]}<BiCaretDown />
        </button>
        <button 
            className="btn btn-sm fw-bold text-primary bg-transparent border-0 px-2 py-1 hover-bg-light rounded"
            onClick={() => setView("year")}
        >
            {currentYear}<BiCaretDown />
        </button>
      </div>

      <button
        className="header-arrow-next btn btn-sm btn-light rounded-circle border d-flex align-items-center justify-content-center"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        style={{ width: "32px", height: "32px" }}
        type="button"
      >
        <FaChevronRight size={10} />
      </button>
    </div>
  );
};