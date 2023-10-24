import axios from "axios";
import Event from "./../models/Event";
import { refresh } from "../state/redux/auth/authActions";
import store from "../state/redux/store";

class EventService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL + "/events";
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("festify-access-token")}`,
      },
    });
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // retry once if token is expired
        const originalRequest = error.config;
        if (error.response.status === 401) {
          return store.dispatch(refresh()).then(() => {
            return this.axios(originalRequest);
          });
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  async getAllEvents() {
    try {
      const response = await this.axios.get("/");
      return response.data.events.map((event) => new Event(event));
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async getEvent(id) {
    try {
      const response = await this.axios.get(`/${id}`);
      return new Event(response.data.event);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async getEventsByType(type) {
    try {
      const response = await this.axios.get(`/type/${type}`);
      return response.data.events.map((event) => new Event(event));
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async createEvent(event) {
    try {
      const response = await this.axios.post("/", event);
      return new Event(response.data.event);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async updateEvent(id, updatedEvent) {
    try {
      const response = await this.axios.put(`/${id}`, updatedEvent);
      return new Event(response.data.event);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async deleteEvent(id) {
    try {
      const response = await this.axios.delete(`/${id}`);
      return new Event(response.data.event);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}

const eventService = new EventService();
export default eventService;
