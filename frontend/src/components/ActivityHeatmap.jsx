import React, { useMemo } from "react";
import { format, startOfDay, subDays, eachDayOfInterval, parseISO, differenceInCalendarDays } from "date-fns";

/**
 * GitHub-style activity heatmap showing the count of completed tasks per day
 * over the last `days` days. Heatmap colored by count (5 levels).
 */
export default function ActivityHeatmap({ todos, days = 84 }) {
  const today = startOfDay(new Date());
  const start = subDays(today, days - 1);

  const counts = useMemo(() => {
    const map = new Map();
    for (const t of todos) {
      if (!t.completed || !t.updated_at) continue;
      const d = startOfDay(parseISO(t.updated_at));
      if (differenceInCalendarDays(today, d) >= days || d > today) continue;
      const key = format(d, "yyyy-MM-dd");
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [todos, days, today]);

  const allDays = useMemo(() => eachDayOfInterval({ start, end: today }), [start, today]);
  const max = Math.max(1, ...Array.from(counts.values()));

  const level = (n) => {
    if (!n) return 0;
    const r = n / max;
    if (r >= 0.8) return 4;
    if (r >= 0.6) return 3;
    if (r >= 0.4) return 2;
    return 1;
  };

  const colorClass = (lv) => [
    "bg-secondary/60",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/70",
    "bg-primary",
  ][lv];

  // Build weeks (columns)
  const weeks = [];
  let week = new Array(allDays[0].getDay()).fill(null);
  for (const d of allDays) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <div data-testid="activity-heatmap">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold tracking-tight">Activity</h3>
        <span className="text-xs text-muted-foreground font-mono">{total} completions · last {days} days</span>
      </div>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((wk, i) => (
          <div key={i} className="flex flex-col gap-1">
            {wk.map((d, j) => {
              if (!d) return <div key={j} className="w-3 h-3" />;
              const key = format(d, "yyyy-MM-dd");
              const n = counts.get(key) || 0;
              const lv = level(n);
              return (
                <div
                  key={j}
                  className={`w-3 h-3 rounded-sm ${colorClass(lv)} hover:ring-2 hover:ring-primary/40 transition-all`}
                  title={`${format(d, "MMM d, yyyy")} — ${n} completed`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted-foreground">
        <span className="mr-1">Less</span>
        {[0,1,2,3,4].map((lv) => <div key={lv} className={`w-3 h-3 rounded-sm ${colorClass(lv)}`} />)}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
