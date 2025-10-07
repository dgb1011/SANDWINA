"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function CoachFilters() {
  const [filters, setFilters] = useState({
    specialty: "any",
    popular: "any",
    niche: "any",
    industry: "any",
  });

  const specialties = [
    "Any",
    "Executive Leadership",
    "Career Transitions",
    "Tech Leadership",
    "Entrepreneurship",
    "Salary Negotiation",
    "Work-Life Balance",
    "Interview Prep",
  ];

  const popularOptions = ["Any", "Most Booked", "Highest Rated", "New Coaches"];

  const niches = [
    "Any",
    "Early Career",
    "Mid-Career",
    "Senior Leadership",
    "Career Changers",
    "First-Time Managers",
    "Returning to Work",
  ];

  const industries = [
    "Any",
    "Technology",
    "Finance",
    "Healthcare",
    "Marketing",
    "Consulting",
    "Education",
    "Non-Profit",
    "Startup",
  ];

  return (
    <Card className="border-2 border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specialties */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-3">Specialties</h3>
          <FilterDropdown
            options={specialties}
            value={filters.specialty}
            onChange={(value) => setFilters({ ...filters, specialty: value })}
          />
        </div>

        {/* Most Popular */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-3">Most Popular</h3>
          <FilterDropdown
            options={popularOptions}
            value={filters.popular}
            onChange={(value) => setFilters({ ...filters, popular: value })}
          />
        </div>

        {/* Client Niche */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-3">Client Niche</h3>
          <FilterDropdown
            options={niches}
            value={filters.niche}
            onChange={(value) => setFilters({ ...filters, niche: value })}
          />
        </div>

        {/* Industry */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-3">Industry</h3>
          <FilterDropdown
            options={industries}
            value={filters.industry}
            onChange={(value) => setFilters({ ...filters, industry: value })}
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() =>
            setFilters({
              specialty: "any",
              popular: "any",
              niche: "any",
              industry: "any",
            })
          }
          className="w-full text-sm text-brand-red hover:text-brand-maroon font-semibold"
        >
          Clear All Filters
        </button>
      </CardContent>
    </Card>
  );
}

function FilterDropdown({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg appearance-none bg-white hover:border-brand-red focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option} value={option.toLowerCase()}>
            {option}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}
