type Day = { id: string; day_no: number | null };

export default function ItineraryDayPicker({
  day,
  days,
  onChange,
}: {
  day: Day;
  days: Day[];
  onChange: (number: number | null) => void;
}) {
  const used = new Set(days.filter((other) => other.id !== day.id).map((other) => other.day_no));
  const selected = typeof day.day_no === "number" && Number.isInteger(day.day_no) ? day.day_no : null;
  const options = Array.from({ length: Math.max(17, days.length + 4) }, (_, index) => index - 2);
  if (selected !== null && !options.includes(selected)) {
    options.push(selected);
    options.sort((a, b) => a - b);
  }

  return (
    <label className="flex items-center gap-2 text-xs font-bold text-ink">
      Day
      <select
        className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"
        value={selected ?? ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
      >
        <option value="">Select day</option>
        {options.filter((number) => !used.has(number)).map((number) => (
          <option key={number} value={number}>Day {number}</option>
        ))}
      </select>
    </label>
  );
}
