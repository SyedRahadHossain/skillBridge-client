"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AvailabilitySlot } from "@/types";
import { Plus, Trash2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityForm({ existing }: { existing: AvailabilitySlot[] }) {
  const router = useRouter();
  const [slots, setSlots] = useState<AvailabilitySlot[]>(
    existing.length > 0 ? existing : []
  );
  const [loading, setLoading] = useState(false);

  const addSlot = (day: string) => {
    setSlots((prev) => [...prev, { day, from: "09:00", to: "17:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: "from" | "to", value: string) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  const handleSave = async () => {
    // Validate all slots
    for (const slot of slots) {
      if (slot.from >= slot.to) {
        toast.error(`${slot.day}: Start time must be before end time`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors/availability/me`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ availability: slots }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save availability");
        return;
      }
      toast.success("Availability saved!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getDaySlots = (day: string) => slots.filter((s) => s.day === day);

  return (
    <div className="flex flex-col gap-4">
      {DAYS.map((day) => {
        const daySlots = getDaySlots(day);
        return (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{day}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addSlot(day)}
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Slot
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {daySlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No availability set for this day.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {slots.map((slot, index) =>
                    slot.day !== day ? null : (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">From</span>
                        <Input
                          type="time"
                          className="w-32"
                          value={slot.from}
                          onChange={(e) => updateSlot(index, "from", e.target.value)}
                        />
                        <span className="text-sm text-muted-foreground">To</span>
                        <Input
                          type="time"
                          className="w-32"
                          value={slot.to}
                          onChange={(e) => updateSlot(index, "to", e.target.value)}
                        />
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => removeSlot(index)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
        {loading ? "Saving..." : "Save Availability"}
      </Button>
    </div>
  );
}
