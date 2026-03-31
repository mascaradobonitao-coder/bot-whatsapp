const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys")
const fs = require("fs")

let comandos = []

// carregar comandos
fs.readdirSync("./comandos").forEach(file => {
    const cmd = require(`./comandos/${file}`)
    comandos.push(cmd)
})

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
            } else {
                console.log("🚫 Sessão inválida, apague a pasta auth")
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

        const cmd = comandos.find(c => c.name === command)

        if (cmd) {
            cmd.execute(sock, msg)
        }
    })
}

startBot()
