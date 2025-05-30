"use client";

import { useState, useEffect } from "react";

export default function EventForm({ event, onCancel }) {
  const [eventInfo, setEventInfo] = useState({
    title: event.title,
    curator: event.curator,
    date: event.date,
    location: event.location,
    description: event.description,
  });

  function handleTitleChange(e) {
    setEventInfo((prev) => ({ ...prev, title: e.target.value }));
  }

  function handleCuratorChange(e) {
    setEventInfo((prev) => ({ ...prev, curator: e.target.value }));
  }

  function handleDateChange(e) {
    setEventInfo((prev) => ({ ...prev, date: e.target.value }));
  }


  function handleDescriptionChange(e) {
    setEventInfo((prev) => ({ ...prev, description: e.target.value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      alert("Event opdateret!");
      window.location.href = "/"; // Luk boksen efter opdatering
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Noget gik galt under opdateringen.");
    }
  }

  async function handleDelete() {
    if (!confirm("Er du sikker på, at du vil slette dette event?")) return;

    try {
      const response = await fetch(`http://localhost:8080/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      alert("Event slettet!");
      if (onCancel) onCancel(); // Luk boksen efter sletning
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Noget gik galt under sletningen.");
    }
  }

    const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");

    useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await fetch("http://localhost:8080/locations");
        const data = await res.json();
        setLocations(data);
        if (data.length > 0) setSelectedLocationId(data[0].id);
      } catch (err) {
        console.error("Kunne ikke hente locations:", err);
      }
    }
    fetchLocations();
  }, []);

  const [artworks, setArtworks] = useState([]);
  const [offset, setOffset] = useState(80500);

  function load() {
    fetch(`https://api.smk.dk/api/v1/art/search/?keys=*&offset=${offset}&rows=50`)
      .then((res) => res.json())
      .then((data) => {
        const newArtworks = data.items || [];
        setArtworks([...artworks, ...newArtworks]);
        setOffset(offset + 50);
      });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <form
      className="flex flex-col shadow-md p-4 h-screen overflow-y-auto"
      onSubmit={handleUpdate}
    >
      <div className="flex items-center justify-between shadow-md text-xl my-2">
        <label className="font-bold pl-4 bg-white" htmlFor="titel">Titel:</label>
        <input
          className="bg-gray-300 ml-4 p-4 text-white w-1/2"
          type="text"
          id="titel"
          value={eventInfo.title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="flex items-center justify-between shadow-md text-xl my-2">
        <label className="font-bold pl-4 bg-white" htmlFor="kurator">Kurator:</label>
        <input
          className="bg-gray-300 ml-4 p-4 text-white w-1/2"
          type="text"
          id="kurator"
          value={eventInfo.curator}
          onChange={handleCuratorChange}
        />
      </div>

      <div className="flex items-center justify-between shadow-md text-xl my-2">
        <label className="font-bold pl-4 bg-white" htmlFor="dato">Dato:</label>
        <input
          className="bg-gray-300 ml-4 p-4 text-white w-1/2"
          type="text"
          id="dato"
          value={eventInfo.date}
          onChange={handleDateChange}
        />
      </div>

     <div className="flex items-center justify-between shadow-md text-xl my-2">
        <label className="font-bold pl-4" htmlFor="location">
          Lokation:
        </label>
        <select
          id="location"
          className="bg-gray-300 text-white ml-4 p-4 w-1/2"
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name} – {loc.address}
            </option>
          ))}
        </select>
      </div>

      <div className="my-4 shadow-md text-xl flex flex-col">
        <label className="font-bold mb-2 mx-4 py-2" htmlFor="beskrivelse">Beskrivelse:</label>
        <textarea
          className="text-white bg-gray-300 px-4 py-2 h-full resize-none"
          id="beskrivelse"
          value={eventInfo.description}
          onChange={handleDescriptionChange}
        />
      </div>

      <h2 className="font-bold text-left pl-4 text-xl my-4">Vælg kunstværker til event:</h2>
      <ul className="grid grid-cols-5 gap-4 my-6 mx-2">
        {artworks
          .filter((art) => art.has_image)
          .map((art) => {
            const imgSrc =
              art.image_thumbnail ||
              art.image?.thumbnail ||
              art.image?.web ||
              art.images?.[0]?.web;
            return (
              <li
                className="shadow-xl/20 rounded-md p-4 bg-white hover:bg-gray-200 ease-in duration-100"
                key={art.id}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={art.titles?.[0]?.title || "Artwork"}
                    title={`ID: ${art.id}`}
                    className="mt-2 w-full h-auto object-cover"
                  />
                ) : (
                  <div className="mt-2 text-gray-500">No image available</div>
                )}
              </li>
            );
          })}
      </ul>

      <button
        type="button"
        onClick={load}
        className="text-[#800000] border-2 border-[#800000] py-2 px-4 mb-10 mt-5 mx-auto hover:bg-[#800000] hover:text-white"
      >
        Indlæs flere
      </button>

      <div className="flex justify-center p-4 gap-20">
        <button
          type="button"
          onClick={handleDelete}
          className="bg-[#800000] text-white text-3xl grid place-items-start items-end w-1/4 h-[60px] px-2 py-1.5 hover:text-[#800000] hover:border-[#800000] hover:border hover:bg-white cursor-pointer"
        >
          Slet Event
        </button>
        <button
          type="submit"
          className="text-3xl grid place-items-start items-end w-1/4 h-[60px] px-2 py-1.5 border border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white cursor-pointer"
        >
          Opdater Event
        </button>
      </div>
    </form>
  );
}
