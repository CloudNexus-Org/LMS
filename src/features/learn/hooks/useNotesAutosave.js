import { useState, useEffect } from "react";
import { getStored, setStored } from "@/utils/storage";
import useAuthStore from "@/store/useAuthStore";
import { createNote, updateNote } from "@/lib/api/learningApi";

const noteKey = (trackId, lessonId) => `cn:notes:${trackId}:${lessonId}`;

export function useNotesAutosave({ trackId, lessonId }) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const storageKey = noteKey(trackId, lessonId);
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    setValue(getStored(storageKey, ""));
  }, [storageKey]);

  useEffect(() => {
    if (value === null) return;
    const id = setTimeout(() => {
      if (setStored(storageKey, value)) {
        setSaved(true);
        const t = setTimeout(() => setSaved(false), 1200);
        if (user?.id && token && value.trim()) {
          const numericLessonId = Number(lessonId);
          const payload = {
            trackId,
            lessonId: Number.isNaN(numericLessonId) ? undefined : numericLessonId,
            content: value,
          };
          const save = noteId
            ? updateNote(user, token, noteId, payload)
            : createNote(user, token, payload).then((n) => {
                if (n?.id) setNoteId(n.id);
                return n;
              });
          save.catch(() => {});
        }
        return () => clearTimeout(t);
      }
    }, 400);
    return () => clearTimeout(id);
  }, [value, storageKey, user, token, trackId, lessonId, noteId]);

  return { value, setValue, saved };
}
