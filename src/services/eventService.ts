import { apiService } from "./api";
import type { Event, EventFormData } from "@/store/slices/eventsSlice";

class EventService {
  async getEvents(params: any) {
    return await apiService.get("/events", { params });
  }

  async getUpcomingEvents(limit: number): Promise<Event[]> {
    return await apiService.get(`/events/upcoming?limit=${limit}`);
  }

  async getEventById(id: number): Promise<Event> {
    return await apiService.get(`/events/${id}`);
  }

  async createEvent(data: EventFormData): Promise<Event> {
    return await apiService.post("/events", data);
  }

  async updateEvent(id: number, data: Partial<EventFormData>): Promise<Event> {
    return await apiService.put(`/events/${id}`, data);
  }

  async deleteEvent(id: number): Promise<void> {
    return await apiService.delete(`/events/${id}`);
  }

  async updateEventCosts(id: number, actualCost?: number, actualRevenue?: number): Promise<Event> {
    return await apiService.patch(`/events/${id}/costs`, { actualCost, actualRevenue });
  }
}

export const eventService = new EventService();
export default eventService;
