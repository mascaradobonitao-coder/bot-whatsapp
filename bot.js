const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            console.log("❌ Conexão caiu")

            if (shouldReconnect) {
                console.log("🔄 Reconectando...")
                startBot()
            }
        }

        if (connection === "open") {
            console.log("✅ Bot conectado!")
        }
    })

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!text) return

        const prefix = "."
        if (!text.startsWith(prefix)) return

        const command = text.slice(1).split(" ")[0]

        // 🔥 COMANDOS

        // .oi
        if (command === "oi") {
            await sock.sendMessage(msg.key.remoteJid, { text: "Oi 👋" })
        }

        // .fig
        if (command === "fig") {
            await sock.sendMessage(msg.key.remoteJid, {
                sticker: { url: "https://i.imgur.com/JP3QG8G.png" }
            })
        }
    })
}

startBot()
