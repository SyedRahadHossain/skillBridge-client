// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Category } from "@/types";

// interface TutorProfileFormProps {
//   categories: Category[];
//   existing?: {
//     bio?: string;
//     hourlyRate?: number;
//     experience?: number;
//     categoryIds?: number[];
//   };
// }

// export default function TutorProfileForm({ categories, existing }: TutorProfileFormProps) {
//   const router = useRouter();
//   const [bio, setBio] = useState(existing?.bio || "");
//   const [hourlyRate, setHourlyRate] = useState(existing?.hourlyRate?.toString() || "");
//   const [experience, setExperience] = useState(existing?.experience?.toString() || "0");
//   const [selectedCategories, setSelectedCategories] = useState<number[]>(existing?.categoryIds || []);
//   const [loading, setLoading] = useState(false);

//   const toggleCategory = (id: number) => {
//     setSelectedCategories((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
//     );
//   };

//   const handleSubmit = async () => {
//     if (!hourlyRate || Number(hourlyRate) <= 0) {
//       toast.error("Hourly rate must be greater than 0");
//       return;
//     }
//     if (selectedCategories.length === 0) {
//       toast.error("Select at least one subject");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors/profile/me`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           bio,
//           hourlyRate: Number(hourlyRate),
//           experience: Number(experience),
//           categoryIds: selectedCategories,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.message || "Failed to update profile");
//         return;
//       }
//       toast.success("Tutor profile saved!");
//       router.refresh();
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader><CardTitle>Tutor Profile</CardTitle></CardHeader>
//       <CardContent>
//         <FieldGroup>
//           <Field>
//             <FieldLabel>Bio</FieldLabel>
//             <textarea
//               className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-24 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//               placeholder="Tell students about yourself..."
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             />
//           </Field>
//           <div className="grid grid-cols-2 gap-4">
//             <Field>
//               <FieldLabel>Hourly Rate ($)</FieldLabel>
//               <Input
//                 type="number"
//                 min={1}
//                 placeholder="e.g. 40"
//                 value={hourlyRate}
//                 onChange={(e) => setHourlyRate(e.target.value)}
//               />
//             </Field>
//             <Field>
//               <FieldLabel>Years of Experience</FieldLabel>
//               <Input
//                 type="number"
//                 min={0}
//                 placeholder="e.g. 3"
//                 value={experience}
//                 onChange={(e) => setExperience(e.target.value)}
//               />
//             </Field>
//           </div>
//           <Field>
//             <FieldLabel>Subjects</FieldLabel>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {categories.map((cat) => (
//                 <button
//                   key={cat.id}
//                   type="button"
//                   onClick={() => toggleCategory(cat.id)}
//                   className={`px-3 py-1 rounded-full text-sm border transition-colors ${
//                     selectedCategories.includes(cat.id)
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "bg-background border-input hover:bg-muted"
//                   }`}
//                 >
//                   {cat.icon} {cat.name}
//                 </button>
//               ))}
//             </div>
//           </Field>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Saving..." : "Save Profile"}
//           </Button>
//         </FieldGroup>
//       </CardContent>
//     </Card>
//   );
// }




"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Category } from "@/types";

interface TutorProfileFormProps {
  categories: Category[];
  existing?: {
    bio?: string;
    hourlyRate?: number;
    experience?: number;
    categoryIds?: number[];
    rating?: number;
    totalReviews?: number;
  };
}

export default function TutorProfileForm({ categories, existing }: TutorProfileFormProps) {
  const router = useRouter();
  const [bio, setBio] = useState(existing?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(existing?.hourlyRate?.toString() || "");
  const [experience, setExperience] = useState(existing?.experience?.toString() || "0");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(existing?.categoryIds || []);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return;
    }
    if (selectedCategories.length === 0) {
      toast.error("Select at least one subject");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors/profile/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bio,
          hourlyRate: Number(hourlyRate),
          experience: Number(experience),
          categoryIds: selectedCategories,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update profile");
        return;
      }
      toast.success("Tutor profile saved!");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current Stats */}
      {existing && (
        <Card>
          <CardHeader><CardTitle>Current Profile Stats</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Hourly Rate</span>
                <span className="font-semibold text-lg">${existing.hourlyRate ?? "—"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Experience</span>
                <span className="font-semibold text-lg">{existing.experience ?? 0} yrs</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Rating</span>
                <span className="font-semibold text-lg flex items-center gap-1">
                  {existing.rating ?? "—"}
                  {existing.rating ? <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> : null}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Total Reviews</span>
                <span className="font-semibold text-lg">{existing.totalReviews ?? 0}</span>
              </div>
            </div>
            {existing.categoryIds && existing.categoryIds.length > 0 && (
              <div className="mt-4">
                <span className="text-xs text-muted-foreground block mb-2">Current Subjects</span>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((c) => existing.categoryIds!.includes(c.id))
                    .map((c) => (
                      <Badge key={c.id} variant="secondary">{c.icon} {c.name}</Badge>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader><CardTitle>Edit Tutor Profile</CardTitle></CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <textarea
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-24 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Tell students about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Hourly Rate ($)</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 40"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Years of Experience</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Subjects</FieldLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      selectedCategories.includes(cat.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input hover:bg-muted"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </Field>
            <Button onClick={handleSubmit} disabled={loading} className="w-fit">
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}