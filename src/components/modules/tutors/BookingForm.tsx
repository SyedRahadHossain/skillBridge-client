"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function BookingForm({ tutorProfileId, hourlyRate }: { tutorProfileId: number; hourlyRate: number }) {
  const { data: session } = authClient.useSession();
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);

  const totalPrice = Math.round((hourlyRate / 60) * duration * 100) / 100;

  const handleBook = async () => {
    if (!session) {
      toast.error("Please login to book a session");
      return;
    }

    if ((session.user as any).role !== "student") {
      toast.error("Only students can book sessions");
      return;
    }

    if (!scheduledAt) {
      toast.error("Please select a date and time");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tutorProfileId, scheduledAt, duration }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Booking failed");
        return;
      }

      toast.success("Session booked successfully!");
      setScheduledAt("");
      setDuration(60);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Session</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>Date & Time</FieldLabel>
            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel>Duration (minutes)</FieldLabel>
            <Input type="number" min={30} max={240} step={30} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </Field>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Total Price</span>
            <span className="font-bold text-lg">${totalPrice}</span>
          </div>
          <Button onClick={handleBook} disabled={loading} className="w-full">
            {loading ? "Booking..." : "Book Now"}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
