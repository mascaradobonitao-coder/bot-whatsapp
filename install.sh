#!/bin/bash

BOT_DIR="$HOME/bot-whatsapp"

echo "🤖 Verificando bot..."

if [ -d "$BOT_DIR" ]; then
    echo "✅ Bot já instalado!"

    cd $BOT_DIR

    if [ -d ".git" ]; then
        echo "🔄 Atualizando bot..."
        git pull
    else
        echo "⚠️ Sem git, pulando atualização"
    fi

    echo "🚀 Iniciando bot..."
    node bot.js
else
    echo "📦 Instalando bot..."

    pkg update -y && pkg upgrade -y
    pkg install nodejs git -y

    git clone https://github.com/mascaradobonitao-coder/bot-whatsapp.git $BOT_DIR

    cd $BOT_DIR
    npm install

    echo "🚀 Iniciando bot..."
    node bot.js
fi
