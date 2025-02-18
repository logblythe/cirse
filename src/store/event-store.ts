import { EventType } from "@/type/event-type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EventState {
  selectedEventId?: string;
  selectedEvent?: EventType;
  selectEvent: (eventId: EventType) => void;
}

export const useEventStore = create<EventState, any>(
  persist(
    (set, get) => ({
      selectEvent: (event) =>
        set((state) => ({
          selectedEvent: event,
          selectedEventId: event.id,
        })),
    }),
    {
      name: "selected-event-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
