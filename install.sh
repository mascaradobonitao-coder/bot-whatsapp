#!/bin/bash

BOT_DIR="$HOME/bot-whatsapp"

echo "🤖 Verificando bot..."

if [ -d "$BOT_DIR" ]; then
    echo "✅ Bot já instalado!"

    cd $BOT_DIR

    echo "🔄 Atualizando bot..."
    git pull

    echo "🚀 Iniciando bot..."
    node bot.js
else
    echo "📦 Instalando bot..."

    pkg update -y && pkg upgrade -y
    pkg install nodejs git -y

    echo "📥 Baixando do GitHub..."
    git clone https://github.com/SEU-USUARIO/bot-whatsapp.git $BOT_DIR

    cd $BOT_DIR

    echo "📦 Instalando dependências..."
    npm install

    echo "🚀 Iniciando bot..."
    node bot.js
fi
