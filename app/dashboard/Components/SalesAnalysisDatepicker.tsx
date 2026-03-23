"use client";

import { useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
    startOfWeek, endOfWeek, subWeeks, subDays, startOfMonth, endOfMonth,
    subMonths, format
} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { CustomDatePickerHeader } from "./DatePickerCustomHeader";

// Make sure to update your types file to match this new simplified version!
interface DatePickerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    dateRange: [Date | null, Date | null];
    setDateRange: (range: [Date | null, Date | null]) => void;
    groupBy: string;
    setGroupBy: (group: string) => void;
    onApply: () => void;
}

export default function SalesAnalysisDatepicker({ 
    open, setOpen, 
    dateRange, setDateRange, 
    groupBy, setGroupBy,
    onApply,
}: DatePickerProps) {

    const today = new Date();
    const [startDate, endDate] = dateRange;
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpen]);

    const presets = [
        { label: "This Week", range: [startOfWeek(today), endOfWeek(today)] },
        { label: "Last Week", range: [startOfWeek(subWeeks(today, 1)), endOfWeek(subWeeks(today, 1))] },
        { label: "Last 7 Days", range: [subDays(today, 6), today] },
        { label: "Current Month", range: [startOfMonth(today), endOfMonth(today)] },
        { label: "Last Month", range: [startOfMonth(subMonths(today, 1)), endOfMonth(subMonths(today, 1))] },
    ];

    if (!open) return null;

    return (
        <div ref={pickerRef} className="meta-picker shadow-lg"
            style={{ width: "max-content", position: "absolute", top: "45px", right: 0, zIndex: 9999, display: "flex", background: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}
        >
            {/* LEFT SIDE: PRESETS */}
            <div style={{ width: "160px", padding: "16px", borderRight: "1px solid #eee", background: "#f8f9fa", display: "flex", flexDirection: "column", gap: "8px" }}>
                {presets.map((p) => (
                    <button key={p.label} onClick={() => setDateRange(p.range as [Date, Date])}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #dee2e6", background: "#fff", cursor: "pointer", fontSize: "13px", textAlign: "left", color: "#495057" }}
                    >
                        {p.label}
                    </button>
                ))}
                <button onClick={() => setDateRange([null, null])}
                    style={{ marginTop: "auto", padding: "8px", border: "none", background: "transparent", color: "#6c757d", cursor: "pointer", fontSize: "13px" }}
                >Reset</button>
            </div>

            {/* RIGHT SIDE: CALENDAR & SETTINGS */}
            <div className="ps-4 pe-4 py-3">
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    inline
                    monthsShown={2}
                    renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
                    maxDate={new Date()}
                />

                <div className="mt-3 pt-3 border-top d-flex gap-3 align-items-center justify-content-between">
                    
                    {/* OUR NEW LOGIC: GROUP BY SELECTOR */}
                    <div className="d-flex align-items-center gap-2 w-50">
                        <label className="text-muted small mb-0 text-nowrap fw-bold">Group By:</label>
                        <select 
                            className="form-select form-select-sm" 
                            value={groupBy} 
                            onChange={(e) => setGroupBy(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {/* APPLY BUTTON */}
                    <button 
                        className="btn btn-primary btn-sm w-50" 
                        onClick={onApply}
                        disabled={!startDate || !endDate} // Disable if dates aren't selected
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}