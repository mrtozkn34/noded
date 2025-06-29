const HBInit = require("haxball.js");
const { fetch } = require("undici");

const room = HBInit({
  roomName: "ChatGPT Haxball Odası",
  maxPlayers: 8,
  public: true,
  noPlayer: true,
});

room.setDefaultStadium("Classic");
room.setScoreLimit(3);
room.setTimeLimit(5);

room.onPlayerJoin = (player) => {
  room.sendChat(`Hoş geldin, ${player.name}! Sohbet etmek için yazabilirsin.`);
};

room.onPlayerChat = async (player, message) => {
  try {
    const res = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    room.sendChat(`🤖 @${player.name}: ${data.reply}`);
  } catch (err) {
    room.sendChat("🤖 Yapay zeka cevap veremedi.");
  }

  return false;
};
