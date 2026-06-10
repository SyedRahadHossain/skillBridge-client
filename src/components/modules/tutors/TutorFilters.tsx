"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/types";
import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function TutorFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("categoryId", categoryId);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    router.push(`/tutors?${params.toString()}`);
    setOpen(false);
  };

  const clearFilters = () => {
    setSearch(""); setCategoryId(""); setMinPrice(""); setMaxPrice(""); setMinRating("");
    router.push("/tutors");
    setOpen(false);
  };

  const hasActiveFilters = search || categoryId || minPrice || maxPrice || minRating;

  const filterContent = (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Search</label>
        <Input placeholder="Search tutors..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Subject</label>
        <Select value={categoryId || "all"} onValueChange={(val) => setCategoryId(val === "all" ? "" : val)}>
          <SelectTrigger><SelectValue placeholder="All subjects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>{cat.icon} {cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Min Price</label>
          <Input type="number" placeholder="$0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Max Price</label>
          <Input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Min Rating</label>
        <Select value={minRating || "any"} onValueChange={(val) => setMinRating(val === "any" ? "" : val)}>
          <SelectTrigger><SelectValue placeholder="Any rating" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any rating</SelectItem>
            <SelectItem value="3">3+ ⭐</SelectItem>
            <SelectItem value="4">4+ ⭐</SelectItem>
            <SelectItem value="4.5">4.5+ ⭐</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">Apply</Button>
        <Button onClick={clearFilters} variant="outline" className="flex-1">Clear</Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full gap-2 justify-between"
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                •
              </span>
            )}
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {open && (
          <Card className="mt-2">
            <CardContent className="p-4">{filterContent}</CardContent>
          </Card>
        )}
      </div>

      {/* Desktop sidebar */}
      <Card className="hidden lg:block">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Filters</h3>
          </div>
          {filterContent}
        </CardContent>
      </Card>
    </>
  );
}