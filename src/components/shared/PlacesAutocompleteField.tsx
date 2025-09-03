"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { UseControllerProps, FieldValues, Control } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

type PlacesAutocompleteFieldProps<T extends FieldValues> =
  UseControllerProps<T> & {
    label: string;
    placeholder?: string;
    onPlaceSelected?: (place: {
      address: string;
      lat: number;
      lng: number;
    }) => void;
  };

export function PlacesAutocompleteField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  onPlaceSelected,
}: PlacesAutocompleteFieldProps<T>) {
  // Load Google Maps API with "places" library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Initialize the autocomplete hook
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Bias suggestions toward San Francisco area
      locationBias: {
        center: { lat: 37.7749, lng: -122.4194 },
        radius: 200 * 1000,
      } as google.maps.CircleLiteral,
    },
    debounce: 200, //delays API calls to avoid spamming.
    initOnMount: isLoaded,
  });

  const [options, setOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update options when API returns data
  useEffect(() => {
    if (status === "OK") {
      // Deduplicate using a Set
      const seen = new Set<string>();
      const unique = data
        .map(({ description }) => description) // get the description string
        .filter((desc) => {
          if (seen.has(desc)) return false; // skip duplicates
          seen.add(desc);
          return true;
        });

      setOptions(unique); // update dropdown options
    } else {
      setOptions([]);
    }
  }, [data, status]);

  // Close dropdown when clicking outside component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOptions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selecting an address
  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setOptions([]);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      // Call callback with selected data
      onPlaceSelected?.({ address, lat, lng });
    } catch (error) {
      console.error("Error getting geocode:", error);
    }
  };

  if (loadError) {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder="Error loading Google Maps" disabled />
        </FormControl>
        <FormMessage>Failed to load Google Maps</FormMessage>
      </FormItem>
    );
  }

  if (!isLoaded) {
    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder="Loading maps..." disabled />
        </FormControl>
      </FormItem>
    );
  }

  return (
    <FormField
      control={control as Control<FieldValues>}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative" ref={containerRef}>
              <Input
                disabled={!ready}
                placeholder={placeholder}
                value={value || field.value || ""}
                onChange={(e) => {
                  setValue(e.target.value);
                  field.onChange(e.target.value);
                }}
                onBlur={() => {
                  field.onChange(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (value && options.includes(value)) {
                      handleSelect(value);
                    }
                  }
                }}
              />
              {options.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md border bg-background shadow-md z-50">
                  {options.slice(0, 5).map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                      onMouseDown={() => handleSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
