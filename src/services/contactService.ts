import { apiService } from "./api";
import type { Contact, ContactFormData } from "@/store/slices/contactsSlice";

class ContactService {
  async getContacts(params: any) {
    return await apiService.get("/contacts", { params });
  }

  async getContactById(id: number): Promise<Contact> {
    return await apiService.get(`/contacts/${id}`);
  }

  async createContact(data: ContactFormData): Promise<Contact> {
    return await apiService.post("/contacts", data);
  }

  async updateContact(id: number, data: Partial<ContactFormData>): Promise<Contact> {
    return await apiService.put(`/contacts/${id}`, data);
  }

  async deleteContact(id: number): Promise<void> {
    return await apiService.delete(`/contacts/${id}`);
  }
}

export const contactService = new ContactService();
export default contactService;
