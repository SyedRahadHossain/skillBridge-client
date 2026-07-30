"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { CalendarClock, CalendarIcon, CheckCircle2, Clock2Icon, Loader2, Ban } from "lucide-react";

const TIME_STEP_MINUTES = 15;
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`
  : "http://localhost:5000/api";

interface AvailabilitySlot { day: string; from: string; to: string; }
interface BusyRange { start: string; end: string; }
interface MinuteRange { from: number; to: number; }

// Build time options from MULTIPLE availability windows for a day (union, not just the first match)
function buildTimeOptionsFromRanges(ranges: MinuteRange[]) {
  const options: string[] = [];
  const seen = new Set<string>();
  for (const range of ranges) {
    for (let mins = range.from; mins <= range.to; mins += TIME_STEP_MINUTES) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      if (!seen.has(label)) {
        seen.add(label);
        options.push(label);
      }
    }
  }
  return options.sort((a, b) => timeStringToMinutes(a) - timeStringToMinutes(b));
}

function formatTimeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatDateForApi(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeStringToMinutes(time: string) {
  const parts = time.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  return h * 60 + m;
}

async function getBusySlotsClient(tutorProfileId: number, dateStr: string) {
  try {
    const res = await fetch(`${API_URL}/bookings/tutor/${tutorProfileId}/busy?date=${dateStr}`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data ?? []) as BusyRange[];
  } catch {
    return [];
  }
}

// Half-open interval check: a start time is "busy" only if it falls STRICTLY inside
// an existing booking — the exact end-minute of one booking is a valid start for the next.
function isStartTimeBusy(date: Date, time: string, busySlots: BusyRange[]) {
  const [h, m] = time.split(":").map(Number);
  const candidate = new Date(date);
  candidate.setHours(h, m, 0, 0);
  return busySlots.some((slot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return candidate >= start && candidate < end; // end is exclusive
  });
}

function TimePickerField({
  label, value, onChange, options, busyTimes,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  busyTimes: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && containerRef.current) {
      const timer = setTimeout(() => {
        const container = containerRef.current;
        if (!container) return;
        const selectedButton = container.querySelector<HTMLButtonElement>('[data-selected="true"]');
        if (selectedButton) {
          container.scrollTop = selectedButton.offsetTop - container.clientHeight / 2 + selectedButton.clientHeight / 2;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-start font-normal">
            <Clock2Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{value ? formatTimeLabel(value) : "Select time"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-0" align="start">
          <div ref={containerRef} className="max-h-64 overflow-y-auto py-1">
            {options.length === 0 ? (
              <p className="text-xs text-muted-foreground px-3 py-2">No available times</p>
            ) : (
              options.map((opt) => {
                const busy = busyTimes.has(opt);
                return (
                  <button
                    key={opt}
                    data-selected={opt === value}
                    type="button"
                    disabled={busy}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                      busy ? "cursor-not-allowed text-muted-foreground/50 line-through" : "hover:bg-muted"
                    } ${opt === value ? "bg-muted font-medium" : ""}`}
                  >
                    {formatTimeLabel(opt)}
                    {busy && <span className="text-[10px] font-normal">Booked</span>}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export default function BookingForm({
  tutorProfileId, hourlyRate, availability = [],
}: {
  tutorProfileId: number;
  hourlyRate: number;
  availability?: AvailabilitySlot[];
}) {
  const { data: session } = authClient.useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [busySlots, setBusySlots] = useState<BusyRange[]>([]);
  const [busyLoading, setBusyLoading] = useState(false);
  const [fullyBookedDates, setFullyBookedDates] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isStudent = !!session && (session.user as any).role === "student";

  const availableDays = useMemo(() => availability.map((a) => a.day.toLowerCase()), [availability]);

  // Fetch busy ranges for the visible calendar month and figure out which days
  // are fully booked, so they can be greyed out directly in the date picker.
  useEffect(() => {
    if (!isStudent) { setFullyBookedDates(new Set()); return; }

    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);

    const fetchMonthBusy = async () => {
      try {
        const res = await fetch(
          `${API_URL}/bookings/tutor/${tutorProfileId}/busy-range?from=${formatDateForApi(monthStart)}&to=${formatDateForApi(monthEnd)}`,
          { credentials: "include", cache: "no-store" }
        );
        if (!res.ok) { setFullyBookedDates(new Set()); return; }
        const json = await res.json();
        const byDate: Record<string, BusyRange[]> = json?.data ?? {};

        const fullyBooked = new Set<string>();
        for (const [dateStr, ranges] of Object.entries(byDate)) {
          const d = new Date(`${dateStr}T00:00:00`);
          const dayName = DAY_NAMES[d.getDay()]?.toLowerCase();
          const daySlots = availability.filter((a) => a.day.toLowerCase() === dayName);
          if (daySlots.length === 0) continue;

          const dayOptions = buildTimeOptionsFromRanges(
            daySlots.map((s) => ({ from: timeStringToMinutes(s.from), to: timeStringToMinutes(s.to) }))
          );
          if (dayOptions.length === 0) continue;

          const busyOptions = dayOptions.filter((t) => isStartTimeBusy(d, t, ranges));
          // Fully booked if every start is busy, or only the closing minute remains free
          const lastFreeIsClosing =
            busyOptions.length === dayOptions.length - 1 &&
            !busyOptions.includes(dayOptions[dayOptions.length - 1]!);

          if (busyOptions.length === dayOptions.length || lastFreeIsClosing) {
            fullyBooked.add(dateStr);
          }
        }
        setFullyBookedDates(fullyBooked);
      } catch {
        setFullyBookedDates(new Set());
      }
    };

    fetchMonthBusy();
  }, [calendarMonth, tutorProfileId, isStudent, availability]);


  // ALL slots for the selected day (a tutor can have multiple ranges per day)
  const selectedDaySlots = useMemo(() => {
    if (!date) return [];
    const dayName = DAY_NAMES[date.getDay()]?.toLowerCase();
    return availability.filter((a) => a.day.toLowerCase() === dayName);
  }, [date, availability]);

  // Individual window labels for the selected day (rendered as separate pills)
  const availabilityWindows = useMemo(() => {
    return selectedDaySlots.map((s) => `${formatTimeLabel(s.from)} – ${formatTimeLabel(s.to)}`);
  }, [selectedDaySlots]);

  // Build time options as the UNION of every slot's range for that day
  const timeOptions = useMemo(() => {
    if (selectedDaySlots.length === 0) return [];
    const ranges: MinuteRange[] = selectedDaySlots.map((s) => ({
      from: timeStringToMinutes(s.from),
      to: timeStringToMinutes(s.to),
    }));
    return buildTimeOptionsFromRanges(ranges);
  }, [selectedDaySlots]);

  useEffect(() => {
    if (!date || !isStudent) { setBusySlots([]); return; }
    setBusyLoading(true);
    getBusySlotsClient(tutorProfileId, formatDateForApi(date))
      .then(setBusySlots)
      .finally(() => setBusyLoading(false));
  }, [date, tutorProfileId, isStudent]);

  const busyStartTimes = useMemo(() => {
    if (!date) return new Set<string>();
    return new Set(timeOptions.filter((t) => isStartTimeBusy(date, t, busySlots)));
  }, [date, timeOptions, busySlots]);

  useEffect(() => {
    const firstFree = timeOptions.find((t) => !busyStartTimes.has(t));
    if (firstFree) {
      setStartTime(firstFree);
      const idx = timeOptions.indexOf(firstFree);
      setEndTime(timeOptions[Math.min(idx + 4, timeOptions.length - 1)] ?? "");
    } else {
      setStartTime("");
      setEndTime("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDaySlots.length, busySlots]);

  const duration = useMemo(() => {
    if (!startTime || !endTime) return 0;
    return timeStringToMinutes(endTime) - timeStringToMinutes(startTime);
  }, [startTime, endTime]);

  // Range conflict: check every 15-min tick STRICTLY BETWEEN start and end (exclusive of end)
  // against busy ranges — so booking 10:00–11:00 right after an existing 9:00–10:00 is allowed.
  const rangeConflict = useMemo(() => {
    if (!date || !startTime || !endTime || duration <= 0) return false;
    const startMin = timeStringToMinutes(startTime);
    const endMin = timeStringToMinutes(endTime);
    return busySlots.some((slot) => {
      const bStart = new Date(slot.start);
      const bEnd = new Date(slot.end);
      const bStartMin = bStart.getHours() * 60 + bStart.getMinutes();
      const bEndMin = bEnd.getHours() * 60 + bEnd.getMinutes();
      // Standard half-open overlap check: overlap if startMin < bEndMin && endMin > bStartMin
      return startMin < bEndMin && endMin > bStartMin;
    });
  }, [date, startTime, endTime, duration, busySlots]);

  const totalPrice = duration > 0 ? Math.round((hourlyRate / 60) * duration * 100) / 100 : 0;

  const scheduledAt = useMemo(() => {
    if (!date || !startTime) return null;
    const pad = (n: number) => String(n).padStart(2, "0");
    const y = date.getFullYear();
    const mo = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const [h, m] = startTime.split(":");
    return `${y}-${mo}-${d}T${h}:${m}:00`;
  }, [date, startTime]);

  // Fully booked if every start time is busy, OR the only free time left has no
  // room for an actual session (e.g. the last free slot is the day's closing minute).
  const noFreeSlotsThisDay = !!date && !busyLoading && isStudent && timeOptions.length > 0 && (
    busyStartTimes.size === timeOptions.length ||
    (!!startTime && !!endTime && duration <= 0)
  );

  const handleBook = async () => {
    if (!session) { toast.error("Please login to book a session"); return; }
    if (!isStudent) { toast.error("Only students can book sessions"); return; }
    if (!date) { toast.error("Please select a date"); return; }
    if (selectedDaySlots.length === 0) { toast.error("Tutor is not available on this day"); return; }
    if (duration <= 0) { toast.error("Please choose a valid time range"); return; }
    if (rangeConflict) { toast.error("This time overlaps an existing booking. Please pick another slot."); return; }
    if (!scheduledAt || new Date(scheduledAt).getTime() < Date.now()) { toast.error("Please choose a time in the future"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tutorProfileId, scheduledAt, duration, startTime, bookingDay: DAY_NAMES[date.getDay()] }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Booking failed"); return; }
      toast.success("Session booked successfully!");
      setDate(undefined);
      setStartTime("");
      setEndTime("");
      setBusySlots([]);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 overflow-hidden py-0">
      <CardHeader className="border-b bg-muted/40 py-5">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4 text-primary" />
          Book a Session
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">${hourlyRate}</span> / hour
        </p>
      </CardHeader>

      <CardContent className="pb-6 pt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-start font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? formatDate(date) : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setDateOpen(false); }}
                  onMonthChange={setCalendarMonth}
                  disabled={(d) => {
                    const day = new Date(d);
                    day.setHours(0, 0, 0, 0);
                    if (day < today) return true;
                    if (availableDays.length > 0) {
                      const dayName = DAY_NAMES[day.getDay()]?.toLowerCase();
                      if (!dayName || !availableDays.includes(dayName)) return true;
                    }
                    if (fullyBookedDates.has(formatDateForApi(day))) return true;
                    return false;
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            {/* Each availability window as its own pill — wraps cleanly instead of one long sentence */}
            {availabilityWindows.length > 0 && (
              <div className="mt-1.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                  Available today
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {availabilityWindows.map((w, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Field>

          {noFreeSlotsThisDay ? (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 flex items-center gap-2 font-medium">
              <Ban className="h-4 w-4 shrink-0" />
              All Booked Today! Please pick another date.
            </div>
          ) : (
            <>
              <TimePickerField label="Start Time" value={startTime} onChange={setStartTime} options={timeOptions} busyTimes={busyStartTimes} />
              <TimePickerField
                label="End Time"
                value={endTime}
                onChange={setEndTime}
                options={timeOptions.filter((t) => timeStringToMinutes(t) > timeStringToMinutes(startTime || "00:00"))}
                busyTimes={new Set<string>()}
              />
            </>
          )}

          {date && !isStudent && (
            <p className="text-xs text-muted-foreground">
              Log in as a student to see this tutor&apos;s booked times.
            </p>
          )}

          {rangeConflict && (
            <p className="text-xs text-destructive -mt-1">
              Selected range overlaps a booked session.
            </p>
          )}

          {!noFreeSlotsThisDay && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {duration > 0 ? `${duration} min session` : "Total price"}
              </span>
              <span className="text-xl font-bold">
                {duration > 0 ? `$${totalPrice.toFixed(2)}` : "—"}
              </span>
            </div>
          )}

          <Button onClick={handleBook} disabled={loading || rangeConflict || duration <= 0 || !!noFreeSlotsThisDay} className="w-full" size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Booking...
              </span>
            ) : noFreeSlotsThisDay ? "Fully Booked" : "Book Now"}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}