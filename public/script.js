const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10,
      timeout: 5000,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
  alert("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Jubair",
}).addTo(map);

const marker = {};

socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (marker[id]) {
    marker[id].setLatLng([latitude, longitude]);
  } else {
    marker[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});
