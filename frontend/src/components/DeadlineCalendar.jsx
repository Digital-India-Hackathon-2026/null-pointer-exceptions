import React, { useState, useMemo } from "react";
import {
    LuCalendar as CalendarIcon,
    LuChevronLeft as ChevronLeft,
    LuChevronRight as ChevronRight,
    LuTriangleAlert as AlertTriangle,
    LuCircleCheck as CheckCircle,
    LuClock as ClockIcon
} from "react-icons/lu";

export default function DeadlineCalendar({ savedSchemes = [] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Parse deadlines from saved schemes
    const parsedDeadlines = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return savedSchemes.map(scheme => {
            let dateObj = null;
            let status = "Ongoing";
            let daysRemaining = null;

            if (scheme.deadline && scheme.deadline !== "Ongoing" && scheme.deadline !== "Ongoing/Rolling") {
                const parsed = new Date(scheme.deadline);
                if (!isNaN(parsed.getTime())) {
                    dateObj = parsed;
                    const diffTime = parsed.getTime() - today.getTime();
                    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (daysRemaining < 0) {
                        status = "Expired";
                    } else if (daysRemaining <= 30) {
                        status = "Closing Soon";
                    } else {
                        status = "Active";
                    }
                }
            }

            return {
                ...scheme,
                dateObj,
                status,
                daysRemaining
            };
        });
    }, [savedSchemes]);

    // Calendar calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Get schemes with deadlines in the currently viewed month
    const currentMonthDeadlines = useMemo(() => {
        return parsedDeadlines.filter(item => {
            if (!item.dateObj) return false;
            return item.dateObj.getFullYear() === year && item.dateObj.getMonth() === month;
        });
    }, [parsedDeadlines, year, month]);

    // Generate calendar days
    const calendarCells = useMemo(() => {
        const cells = [];

        // Add empty/previous month padding cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push({ day: null, key: `empty-${i}` });
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

            const dayDeadlines = parsedDeadlines.filter(item => {
                if (!item.dateObj) return false;
                return (
                    item.dateObj.getDate() === day &&
                    item.dateObj.getMonth() === month &&
                    item.dateObj.getFullYear() === year
                );
            });

            cells.push({
                day,
                isToday,
                deadlines: dayDeadlines,
                key: `day-${day}`
            });
        }

        return cells;
    }, [daysInMonth, firstDayOfMonth, month, year, parsedDeadlines]);

    // Format date helper
    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <CalendarIcon size={18} className="text-emerald-600" /> Schemes Deadlines Tracker
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Monitor and track deadlines of your bookmarked benefits.
                    </p>
                </div>

                {/* Month selector */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 border border-slate-205 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-slate-800 min-w-[100px] text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 border border-slate-205 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left/Middle: Calendar Grid */}
                <div className="md:col-span-2 border-r border-slate-100 pr-0 md:pr-6">
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
                        <div>SUN</div>
                        <div>MON</div>
                        <div>TUE</div>
                        <div>WED</div>
                        <div>THU</div>
                        <div>FRI</div>
                        <div>SAT</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarCells.map((cell) => {
                            if (!cell.day) {
                                return (
                                    <div
                                        key={cell.key}
                                        className="aspect-square bg-slate-50/40 rounded-lg border border-slate-50/20"
                                    />
                                );
                            }

                            const hasDeadlines = cell.deadlines.length > 0;
                            const hasClosingSoon = cell.deadlines.some(d => d.status === "Closing Soon");
                            const hasExpired = cell.deadlines.some(d => d.status === "Expired");

                            let bgClass = "bg-white hover:bg-slate-50 border-slate-100";
                            let textClass = "text-slate-700";

                            if (hasDeadlines) {
                                if (hasExpired) {
                                    bgClass = "bg-red-50/30 hover:bg-red-100/40 border-red-300 border-2";
                                } else if (hasClosingSoon) {
                                    bgClass = "bg-amber-50/60 hover:bg-amber-100/70 border-amber-400 border-2 shadow-sm";
                                } else {
                                    bgClass = "bg-emerald-50/30 hover:bg-emerald-100/40 border-emerald-300 border-2";
                                }
                            }

                            if (cell.isToday) {
                                bgClass = "bg-slate-900 border-slate-900";
                                textClass = "text-white font-bold";
                            }

                            return (
                                <div
                                    key={cell.key}
                                    className={`aspect-square p-1 rounded-xl border relative group flex flex-col justify-between transition-all ${bgClass}`}
                                >
                                    <span className={`text-xs font-semibold ${textClass}`}>
                                        {cell.day}
                                    </span>

                                    {/* Indicators */}
                                    {hasDeadlines && (
                                        <div className="flex gap-0.5 justify-end">
                                            {hasExpired && (
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" title="Expired deadline" />
                                            )}
                                            {hasClosingSoon && (
                                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" title="Closing soon" />
                                            )}
                                            {!hasExpired && !hasClosingSoon && (
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" title="Active deadline" />
                                            )}
                                        </div>
                                    )}

                                    {/* Tooltip on Hover */}
                                    {hasDeadlines && (
                                        <div className="absolute z-10 hidden group-hover:block bg-slate-950 text-white rounded-lg p-2 text-[10px] w-48 shadow-xl border border-slate-800 -bottom-2 -left-1/2 translate-y-full">
                                            <p className="font-semibold border-b border-slate-800 pb-1 mb-1 text-slate-300">
                                                Deadlines for {cell.day} {monthNames[month]}:
                                            </p>
                                            <ul className="space-y-1">
                                                {cell.deadlines.map(d => (
                                                    <li key={d.id || d._id} className="truncate">
                                                        • {d.title || d.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Deadline Timeline */}
                <div className="md:col-span-1 flex flex-col justify-between min-h-[300px]">
                    <h4 className="text-xs font-bold text-slate-400 tracking-wider mb-3">
                        DEADLINES IN THE TIMELINE
                    </h4>

                    {parsedDeadlines.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <p className="text-xs text-slate-400">Save schemes with active deadlines to track them here.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[280px]">
                            {parsedDeadlines.map((scheme) => {
                                let badgeBg = "bg-slate-50 text-slate-650";
                                let badgeText = "Rolling / Ongoing";
                                let badgeIcon = <ClockIcon size={12} />;

                                if (scheme.status === "Expired") {
                                    badgeBg = "bg-red-50 text-red-700 border border-red-100";
                                    badgeText = "Expired";
                                    badgeIcon = <AlertTriangle size={12} />;
                                } else if (scheme.status === "Closing Soon") {
                                    badgeBg = "bg-amber-50 text-amber-700 border border-amber-200";
                                    badgeText = `Closing Soon (${scheme.daysRemaining} days)`;
                                    badgeIcon = <AlertTriangle size={12} className="animate-bounce" />;
                                } else if (scheme.status === "Active") {
                                    badgeBg = "bg-emerald-50 text-emerald-805 border border-emerald-150";
                                    badgeText = `Active (${scheme.daysRemaining} days)`;
                                    badgeIcon = <CheckCircle size={12} />;
                                }

                                let cardBorderBg = "border-slate-100 bg-slate-50/20";
                                if (scheme.status === "Expired") {
                                    cardBorderBg = "border-red-200 bg-red-50/10 hover:bg-red-50/20";
                                } else if (scheme.status === "Closing Soon") {
                                    cardBorderBg = "border-amber-300 bg-amber-50/20 hover:bg-amber-50/35 ring-1 ring-amber-300/40";
                                } else if (scheme.status === "Active") {
                                    cardBorderBg = "border-emerald-200 bg-emerald-50/5 hover:bg-emerald-50/15";
                                }

                                return (
                                    <div
                                        key={scheme.id || scheme._id}
                                        className={`p-3 border rounded-xl hover:shadow-xs transition-all ${cardBorderBg}`}
                                    >
                                        <h5 className="text-xs font-bold text-slate-905 truncate" title={scheme.title || scheme.name}>
                                            {scheme.title || scheme.name}
                                        </h5>

                                        <div className="flex items-center justify-between gap-2 mt-2">
                                            <span className="text-[10px] text-slate-500">
                                                {scheme.deadline && scheme.deadline !== "Ongoing" ? formatDate(scheme.deadline) : "No cutoff date"}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${badgeBg}`}>
                                                {badgeIcon} {badgeText}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
