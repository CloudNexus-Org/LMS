import { useState, useEffect } from "react";
import { getStored, setStored } from "@/utils/storage";

const noteKey = (trackId, lessonId) => `cn:notes:${trackId}:${lessonId}`;

export function useNotesAutosave({ trackId, lessonId }) {
  const storageKey = noteKey(trackId, lessonId);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  // Load from local storage initially
  useEffect(() => {
    setValue(getStored(storageKey, ""));
  }, [storageKey]);

  // Autosave when value changes
  useEffect(() => {
    if (value === null) return;
    const id = setTimeout(() => {
      if (setStored(storageKey, value)) {
        setSaved(true);
        const t = setTimeout(() => setSaved(false), 1200);
        return () => clearTimeout(t);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [value, storageKey]);

  return { value, setValue, saved };
}
