import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  DatePicker,
} from "antd";
import {
  GoogleOutlined,
  DeleteOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import {
  CLIENT_ID,
  API_KEY,
  SCOPES,
  DISCOVERY_DOC,
} from "../../../lib/Calendar/config";

const localizer = momentLocalizer(moment);

let tokenClient;
let gapiInited = false;
let gisInited = false;

const { RangePicker } = DatePicker;
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const Plans = () => {
  // Initialize state variables
  const [events, setEvents] = useState([]); // State to store events
  const [showModal, setShowModal] = useState(false); // State to control visibility of modal
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event for viewing/updating
  const [newEvent, setNewEvent] = useState({
    // State to store data for creating a new event
    summary: "",
    location: "",
    description: "",
    start: "",
    end: "",
  });

  // Load Google API and Identity Services scripts when the component mounts
  useEffect(() => {
    loadScripts();
  }, []);

  // Function to handle Google API loaded
  const gapiLoaded = () => {
    gapi.load("client", initializeGapiClient);
  };

  // Load Google API and Identity Services scripts dynamically
  const loadScripts = () => {
    // Load Google API client script
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    // Load Google Identity Services script
    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.onload = gisLoaded;
    document.body.appendChild(script2);
  };

  // Initialize Google API client
  const initializeGapiClient = async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      maybeEnableButtons();
    } catch (error) {
      console.error("Error initializing GAPI client:", error);
    }
  };

  // Initialize Google Identity Services client
  const gisLoaded = () => {
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleAuthResponse,
      });
      gisInited = true;
      maybeEnableButtons();
    } catch (error) {
      console.error("Error initializing GIS client:", error);
    }
  };

  // Enable authorization buttons if both APIs are initialized
  const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      document.getElementById("authorize_button").style.visibility = "visible";
    }
  };

  // Handle authorization click
  const handleAuthClick = () => {
    const token = gapi.client.getToken();
    tokenClient.requestAccessToken({ prompt: token === null ? "consent" : "" });
  };

  // Handle authorization response
  const handleAuthResponse = async (resp) => {
    if (resp.error !== undefined) {
      console.error("Error during auth:", resp.error);
      throw resp;
    }
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_button").innerText = "Refresh";
    await listUpcomingEvents();
  };

  // Handle signout click
  const handleSignoutClick = () => {
    const token = gapi.client.getToken();
    if (token) {
      gapi.client.setToken("");
      setEvents([]);
      document.getElementById("authorize_button").innerText = "Authorize";
      document.getElementById("signout_button").style.visibility = "hidden";
    }
  };

  // Function to list upcoming events from Google Calendar
  const listUpcomingEvents = async () => {
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      });

      const events = response.result.items.map((event) => ({
        id: event.id,
        title: event.summary,
        location: event.location,
        description: event.description,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
      }));

      setEvents(events);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Function to open modal for creating new event
  const openCreateEventModal = () => setShowModal(true);

  // Function to close modal for creating new event
  const closeCreateEventModal = () => setShowModal(false);

  // Function to handle input change for creating new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  // Function to handle click on existing event
  const handleEventClick = (event) => {
    if (event) {
      setSelectedEvent({
        id: event.id,
        summary: event.title,
        location: event.location || "",
        description: event.description || "",
        start: event.start,
        end: event.end,
      });
    }
  };

  // Function to handle creation of new event
  const handleCreateEvent = async () => {
    try {
      // Construct event object
      const event = {
        summary: newEvent.summary,
        location: newEvent.location,
        description: newEvent.description,
        start: {
          dateTime: new Date(newEvent.start).toISOString(),
          timeZone: "Asia/Kuala_Lumpur",
        },
        end: {
          dateTime: new Date(newEvent.end).toISOString(),
          timeZone: "Asia/Kuala_Lumpur",
        },
      };

      // Insert event into Google Calendar
      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      // Fetch updated list of events
      await listUpcomingEvents();

      // Reset new event state
      setNewEvent({
        summary: "",
        location: "",
        description: "",
        start: "",
        end: "",
      });

      // Close modal
      closeCreateEventModal();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Function to handle updating an existing event
  const handleUpdateEvent = async () => {
    try {
      // Fetch current event
      const response = await gapi.client.calendar.events.get({
        calendarId: "primary",
        eventId: selectedEvent.id,
      });
      const currentEvent = response.result;

      // Construct updated event object
      const updatedEvent = {
        ...currentEvent,
        summary: selectedEvent.summary,
        location: selectedEvent.location,
        description: selectedEvent.description,
        start: {
          dateTime: new Date(selectedEvent.start).toISOString(),
          timeZone: "Asia/Kuala_Lumpur",
        },
        end: {
          dateTime: new Date(selectedEvent.end).toISOString(),
          timeZone: "Asia/Kuala_Lumpur",
        },
      };

      // Update event in Google Calendar
      await gapi.client.calendar.events.update({
        calendarId: "primary",
        eventId: selectedEvent.id,
        resource: updatedEvent,
      });

      // Fetch updated list of events
      await listUpcomingEvents();

      // Display success message
      message.success("Event updated successfully.");

      // Clear selected event state
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
      message.error("Failed to update event.");
    }
  };

  // Function to handle deletion of an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      console.error("No event selected.");
      return;
    }

    try {
      // Delete event from Google Calendar
      await gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: selectedEvent.id,
      });

      // Fetch updated list of events
      await listUpcomingEvents();

      // Display success message
      message.success("Event deleted successfully.");

      // Clear selected event state
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      message.error("Failed to delete event.");
    }
  };

  // Function to disable past dates in date picker
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // structure of a newEvent object
  const { summary, location, description, start, end } = newEvent;

  return (
    <div>
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <Button
            id="authorize_button"
            type="primary"
            icon={<GoogleOutlined />}
            onClick={handleAuthClick}
          >
            Authorize
          </Button>
          <Button
            id="signout_button"
            icon={<PoweroffOutlined />}
            onClick={handleSignoutClick}
          >
            Sign Out
          </Button>
        </div>
        <Button
          type="primary"
          style={{ marginBottom: "1rem" }}
          onClick={openCreateEventModal}
        >
          Create New Event
        </Button>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
        />
      </div>

      {/* Modal for Creating New Event */}
      <Modal
        title="Create New Event"
        open={showModal}
        onCancel={closeCreateEventModal}
        onOk={handleCreateEvent}
      >
        <Form layout="vertical">
          <Form.Item label="Event Title">
            <Input
              name="summary"
              value={summary}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Location">
            <Input
              name="location"
              value={location}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Description">
            <Input.TextArea
              name="description"
              value={description}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Date and Time">
            <RangePicker
              showTime
              disabledDate={disabledDate}
              style={{ width: "100%" }}
              value={[start ? dayjs(start) : null, end ? dayjs(end) : null]}
              onChange={(dates) => {
                if (dates) {
                  setNewEvent({
                    ...newEvent,
                    start: dates[0].toDate(),
                    end: dates[1].toDate(),
                  });
                } else {
                  setNewEvent({ ...newEvent, start: "", end: "" });
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing or Updating Existing Event */}
      <Modal
        title="Event Details"
        open={selectedEvent !== null}
        onCancel={() => setSelectedEvent(null)}
        footer={[
          <Button key="update" type="primary" onClick={handleUpdateEvent}>
            Update
          </Button>,
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={handleDeleteEvent}
            okText="Yes"
            cancelText="No"
          >
            <Button key="delete" type="danger">
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={() => setSelectedEvent(null)}>
            Cancel
          </Button>,
        ]}
      >
        {selectedEvent && (
          <Form layout="vertical">
            <Form.Item label="Event Title">
              <Input
                value={selectedEvent.summary}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    summary: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Location">
              <Input
                value={selectedEvent.location}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    location: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <Input.TextArea
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Date and Time">
              <RangePicker
                showTime
                disabledDate={disabledDate}
                style={{ width: "100%" }}
                value={[
                  selectedEvent.start ? dayjs(selectedEvent.start) : null,
                  selectedEvent.end ? dayjs(selectedEvent.end) : null,
                ]}
                onChange={(dates) => {
                  if (dates) {
                    setSelectedEvent({
                      ...selectedEvent,
                      start: dates[0].toDate(),
                      end: dates[1].toDate(),
                    });
                  } else {
                    setSelectedEvent({
                      ...selectedEvent,
                      start: "",
                      end: "",
                    });
                  }
                }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Plans;
