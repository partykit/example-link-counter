import "./styles.css";

import PartySocket from "partysocket";

const PAGE_LINKS: Record<string, string[]> = {
  a: ["b", "c", "d"],
  b: ["a", "b", "c"],
  c: ["a", "b", "d"],
  d: ["a"],
};

declare const PARTYKIT_HOST: string;

const room = window.location.pathname.match(/\/pages\/(\w*)/i)?.[1]!;
if (!room) {
  window.location.replace("/pages/a");
}

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;
const links = PAGE_LINKS[room!];
for (const link of links) {
  const a = document.createElement("a");
  a.id = link;
  a.className = "page-link";
  a.href = `/pages/${link}`;
  a.innerText = `Page ${link}`;
  output.appendChild(a);
}

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const conn = new PartySocket({
  host: PARTYKIT_HOST,
  party: "page",
  room,
});

// Let's listen for when the connection opens
conn.addEventListener("open", () => {
  conn.send(
    JSON.stringify({
      type: "subscribe",
      links,
    })
  );
});

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "update") {
    for (const [id, count] of Object.entries(data.connections)) {
      const link = document.getElementById(id);
      if (link) {
        link.setAttribute("data-count", `${count}`);
      }
    }
  }
});
