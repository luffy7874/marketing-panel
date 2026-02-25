"use client";

import { useRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
    startOfWeek, endOfWeek, subWeeks, subDays, startOfMonth, endOfMonth,
    subMonths, subYears, differenceInDays, subDays as subtractDays, format
} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { MetaDateRangeOption } from "../utils/types";
import { CustomDatePickerHeader } from "./DatePickerCustomHeader";


export default function MetaDateRange({ 
    open, setOpen, 
    dateRange, setDateRange, 
    compare, setCompare,
    compareRange, setCompareRange,
    onApply,
}: MetaDateRangeOption) {

    const today = new Date();
    const [startDate, endDate] = dateRange;
    const [compStartDate, compEndDate] = compareRange;
    const pickerRef = useRef<HTMLDivElement>(null);
    const [compareOption, setCompareOption] = useState("previous_period");

    // --- AUTO-CALCULATE LOGIC ---
    useEffect(() => {
        if (!compare || !startDate || !endDate) return;
        if (compareOption === "custom") return;

        let newStart: Date | null = null;
        let newEnd: Date | null = null;

        if (compareOption === "previous_period") {
            const daysDiff = differenceInDays(endDate, startDate) + 1;
            newStart = subtractDays(startDate, daysDiff);
            newEnd = subtractDays(endDate, daysDiff);
        } else if (compareOption === "previous_month") {
            newStart = subMonths(startDate, 1);
            newEnd = subMonths(endDate, 1);
        } else if (compareOption === "previous_year") {
            newStart = subYears(startDate, 1);
            newEnd = subYears(endDate, 1);
        }

        if (newStart && newEnd && (compStartDate?.getTime() !== newStart.getTime() || compEndDate?.getTime() !== newEnd.getTime())) {
            setCompareRange([newStart, newEnd]);
        }
    }, [startDate, endDate, compare, compareOption, setCompareRange, compStartDate, compEndDate]);

    // Manual change handler
    const handleManualCompareChange = (date: Date | null, isStart: boolean) => {
        setCompareOption("custom");
        if (isStart) setCompareRange([date, compEndDate]);
        else setCompareRange([compStartDate, date]);
    };

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
            style={{ width: "max-content", position: "absolute", top: "45px", right: 0, zIndex: 999, display: "flex", background: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}
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
                <button onClick={() => { setDateRange([null, null]); setCompare(false); }}
                    style={{ marginTop: "auto", padding: "8px", border: "none", background: "transparent", color: "#6c757d", cursor: "pointer", fontSize: "13px" }}
                >Reset</button>
            </div>

            {/* RIGHT SIDE: CALENDAR */}
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

                <div className="mt-4 pt-3 border-top">
                    {/* TOGGLE */}
                    <div className="form-check form-check-outline form-check-secondary mb-3">
                        <input className="form-check-input" id="compareCheck" type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
                        <label className="form-check-label fw-bold" htmlFor="compareCheck">Compare</label>
                    </div>

                    {compare && (
                        <>
                            {/* ROW 1: CURRENT PERIOD */}
                            <div className="d-flex gap-2 mb-2 align-items-center">
                                <select className="form-select form-select-sm w-30" disabled><option>Current Selection</option></select>
                                <DatePicker 
                                    className="form-control form-control-sm"
                                    selected={startDate} 
                                    onChange={(date: Date | null) => setDateRange([date, endDate])}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="dd-MMM-yyyy"
                                    renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
                                    maxDate={new Date()}
                                />
                                <DatePicker
                                    className="form-control form-control-sm"
                                    selected={endDate}
                                    onChange={(date: Date | null) => setDateRange([startDate, date])}
                                    selectsEnd startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate || undefined}
                                    dateFormat="dd-MMM-yyyy"
                                    renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
                                    maxDate={new Date()}
                                />
                            </div>

                            {/* ROW 2: COMPARE PERIOD */}
                            <div className="d-flex gap-2 mb-3 align-items-center">
                                <select className="form-select form-select-sm w-30" value={compareOption} onChange={(e) => setCompareOption(e.target.value)}>
                                    <option value="previous_period">Previous Period</option>
                                    <option value="previous_month">Previous Month</option>
                                    <option value="previous_year">Previous Year</option>
                                    <option value="custom">Custom</option>
                                </select>
                                <DatePicker
                                    className="form-control form-control-sm"
                                    selected={compStartDate} 
                                    onChange={(date: Date | null) => handleManualCompareChange(date, true)}
                                    placeholderText="Start Date" 
                                    dateFormat="dd-MMM-yyyy" 
                                    renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
                                    maxDate={new Date()}
                                />
                                <DatePicker
                                    className="form-control form-control-sm"
                                    selected={compEndDate}
                                    onChange={(date: Date | null) => handleManualCompareChange(date, false)}
                                    minDate={compStartDate || undefined}
                                    placeholderText="End Date"
                                    dateFormat="dd-MMM-yyyy"
                                    renderCustomHeader={(props) => <CustomDatePickerHeader {...props} />}
                                    maxDate={new Date()}
                                />
                            </div>
                        </>
                    )}
                    
                    {/* APPLY BUTTON */}
                    <button className="btn btn-primary btn-sm w-100" onClick={onApply}>Apply</button>
                </div>
            </div>
        </div>
    );
}