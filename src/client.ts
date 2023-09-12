import "./styles.css";

import PartySocket from "partysocket";

declare const PARTYKIT_HOST: string;

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;

const room =
  new URLSearchParams(window.location.search).get("room") ?? "default-room";
const links = (
  new URLSearchParams(window.location.search).get("links") ?? "other-room"
).split(",");

// Helper function to add a new line to the DOM
function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement("br"));
}

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const conn = new PartySocket({
  host: PARTYKIT_HOST,
  party: "page",
  room,
});

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  add(event.data);
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  add(`You're on page "${room}" with links to: ${links.join(",")}`);
  conn.send(
    JSON.stringify({
      type: "init",
      links,
    })
  );
});
