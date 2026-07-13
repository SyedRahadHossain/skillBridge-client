"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { CalendarClock, CalendarIcon, Clock2Icon, Loader2 } from "lucide-react";

const TIME_STEP_MINUTES = 15;
const DAY_START_HOUR = 6; // 6:00 AM
const DAY_END_HOUR = 23; // 11:00 PM

function buildTimeOptions() {
  const options: string[] = [];
  for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += TIME_STEP_MINUTES) {
      options.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }
  return options;
}

function formatTimeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeStringToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function TimePickerField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      // Wait a tick for the popover content to mount before scrolling
      const id = requestAnimationFrame(() => {
        selectedRef.current?.scrollIntoView({ block: "center" });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start font-normal"
          >
            <Clock2Icon className="mr-2 h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">{formatTimeLabel(value)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0" align="start">
          <div ref={listRef} className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt}
                ref={opt === value ? selectedRef : undefined}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors ${
                  opt === value ? "bg-muted font-medium" : ""
                }`}
              >
                {formatTimeLabel(opt)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export default function BookingForm({
  tutorProfileId,
  hourlyRate,
}: {
  tutorProfileId: number;
  hourlyRate: number;
}) {
  const { data: session } = authClient.useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("10:30");
  const [endTime, setEndTime] = useState("11:30");
  const [loading, setLoading] = useState(false);

  const timeOptions = useMemo(() => buildTimeOptions(), []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Duration derived from start/end time, in minutes
  const duration = useMemo(() => {
    const start = timeStringToMinutes(startTime);
    const end = timeStringToMinutes(endTime);
    return end - start;
  }, [startTime, endTime]);

  const totalPrice =
    duration > 0 ? Math.round((hourlyRate / 60) * duration * 100) / 100 : 0;

  const scheduledAt = useMemo(() => {
    if (!date || !startTime) return null;
    const [h, m] = startTime.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(h, m, 0, 0);
    return combined;
  }, [date, startTime]);

  const handleBook = async () => {
    if (!session) {
      toast.error("Please login to book a session");
      return;
    }

    if ((session.user as any).role !== "student") {
      toast.error("Only students can book sessions");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (duration <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    if (!scheduledAt || scheduledAt.getTime() < Date.now()) {
      toast.error("Please choose a time in the future");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            tutorProfileId,
            scheduledAt: scheduledAt.toISOString(),
            duration,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Booking failed");
        return;
      }

      toast.success("Session booked successfully!");
      setDate(undefined);
      setStartTime("10:30");
      setEndTime("11:30");
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
          <span className="font-semibold text-foreground">${hourlyRate}</span> /
          hour
        </p>
      </CardHeader>

      <CardContent className="pb-6 pt-1">
        <FieldGroup>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? formatDate(date) : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setDateOpen(false);
                  }}
                  disabled={(d) => {
                    const day = new Date(d);
                    day.setHours(0, 0, 0, 0);
                    return day < today;
                  }}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
            <TimePickerField
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              options={timeOptions}
            />
            <TimePickerField
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              options={timeOptions}
            />
          </Field>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {duration > 0 ? `${duration} min session` : "Total price"}
            </span>
            <span className="text-xl font-bold">
              {duration > 0 ? `$${totalPrice.toFixed(2)}` : "—"}
            </span>
          </div>

          <Button
            onClick={handleBook}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Booking...
              </span>
            ) : (
              "Book Now"
            )}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
