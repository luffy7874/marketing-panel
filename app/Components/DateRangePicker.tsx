"use client";

import { useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
	startOfWeek,
	endOfWeek,
	subWeeks,
	subDays,
	startOfMonth,
	endOfMonth,
	addMonths,
} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { MetaDateRangeOption } from "../utils/types";

export default function MetaDateRange({ open, setOpen, dateRange, setDateRange, onChange }: MetaDateRangeOption)
{
	const today = new Date();

	const [startDate, endDate] = dateRange;
	const pickerRef = useRef<HTMLDivElement>(null);


	const presets = [
		{
			label: "This Week",
			range: [startOfWeek(today), endOfWeek(today)],
		},
		{
			label: "Last Week",
			range: [
				startOfWeek(subWeeks(today, 1)),
				endOfWeek(subWeeks(today, 1)),
			],
		},
		{
			label: "Last 7 Days",
			range: [subDays(today, 6), today],
		},
		{
			label: "Current Month",
			range: [startOfMonth(today), endOfMonth(today)],
		},
		{
			label: "Next Month",
			range: [
				startOfMonth(addMonths(today, 1)),
				endOfMonth(addMonths(today, 1)),
			],
		},
	];

	// Close on outside click
	useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
            pickerRef.current &&
            !pickerRef.current.contains(e.target as Node)
            ) {
            setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpen]);

	if (!open) return null;

	return (
        <div
            ref={pickerRef}
            className="meta-picker"
            style={{
            position: "absolute",
            top: "45px",
            right: 0,
            zIndex: 999,
            display: "flex",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            overflow: "hidden",
            }}
        >
            {/* LEFT SIDE - PRESETS */}
            <div
            style={{
                width: "180px",
                padding: "16px",
                borderRight: "1px solid #eee",
                background: "#fafafa",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}
            >
            {presets.map((p) => (
                <button
                key={p.label}
                onClick={() => setDateRange(p.range as [Date, Date])}
                style={{
                    padding: "10px",
                    borderRadius: "30px",
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 500,
                }}
                >
                {p.label}
                </button>
            ))}

            <button
                onClick={() => setDateRange([null, null])}
                style={{
                marginTop: "auto",
                padding: "8px",
                border: "none",
                background: "transparent",
                color: "#888",
                cursor: "pointer",
                }}
            >
                Reset
            </button>
            </div>

                {/* RIGHT SIDE - CALENDAR */}
                <div style={{ padding: "16px" }}>
                <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        setDateRange(update);
                            if (update[0] && update[1]) {
                                setOpen(false);
                            }
                        }
                    }
                    inline
                />
            </div>
        </div>
    );

}
