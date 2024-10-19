const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia01ENmlNbU94Tm5aU2t0RTByS2J3TnU0SVRnR2JiaDk2YXBCZ3FVUXhsUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN2ltNzhaM0p4UlhYVUhwK1EwbmZDWUdMN29PbHdINmJFL3FQMXNZQTdBND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJHRk1GVnFNbFJ4MUo2dkhOZ3FEK2tkTWE5V21Ld2tIUXArMzF4MDc5aUVFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxa0ltcllMSkh2ZXczT1VBY2oxYXZiSlJlRWZIbzB1akkwZC83R1BqTEVnPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhKdkZZR1l5WVMvRmYzdThscTBOVGFZaUwweGI0V2c3OThFLzlzN2cyMmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InE1Z2Z3SUluSFNFK1VlRlJGZnI4RERJeEc1cGJoUWJJRzJRM2JHQm1jbWc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaU5zT0lHQ1dKYzhoVFpHZTlFZlFCdEF5MlhkcXQ4SGlkUExINWxKaktHbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYnRDYlNGTVRSM3ozS3puT3BWZDVzZnVVMm11dHVnWWRXSWV5eXhSSHdTUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlhDbnFKQVQwSTlSaWRkM1lRWXcyNTBTZ2loTGc1NENWcEZKQTFydUNsQ2tqRVRhVXYzMnl0MGdUYTJ5TktyWmtLWWRnNzVKdUd5Q29kakE0VVBKaGpRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6ODUsImFkdlNlY3JldEtleSI6IjM4bEhLeXcxLzJ5VlRyT2t4TUFSanArd09OSzhHQmdoTWRqUXZMVnUxeE09IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IjR5RWgzYm9WU1NxUmpoWlAwQzRJZmciLCJwaG9uZUlkIjoiZGRiMGI2ODQtMWU1YS00NjJjLTg2MjYtZmY1Njk2ZjY4NWJhIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InIwRUhvamNyZkdUaEU4OXBwWFRFV0p1V0k0Yz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkYS9XYzJCSG1kSHVvRDdlcDRlS2hUTlFvQ2M9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiU1ZFOTRGRzkiLCJtZSI6eyJpZCI6IjI1NDc5NDA2NDU1NzoyMkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTmVrZ3QwREVLM2l6cmdHR0FNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiMzZKcUVTdUZveFVwVThpZzlBVU1BTU83aFFjU25KYmFuQTRtWXF4YjVuZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNVFyZjgyUFhiSHVxeDkvWmtCL2oxV3J4dEp1eGdOeElCUitQejNta2R2WGNvRmo4Lzk1REJJM1cwVmlZSUJxa3J0RkZkMWZQM0VGMVRQQ0xiSnoxQnc9PSIsImRldmljZVNpZ25hdHVyZSI6IkMvbUh0Z2lFMXRNWkdCa2c5YStTUXNEeXFzVkRtSkR6ZWtYNGV3ZG96djAyK0JSNVpDN0VFV2tQMWFHWEhNanJrS0VnV1RYc1h3RC8rcTJpdWk4NWpRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0Nzk0MDY0NTU3OjIyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmQraWFoRXJoYU1WS1ZQSW9QUUZEQUREdTRVSEVweVcycHdPSm1Lc1crWjQifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjkzNDM4MDJ9',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "echo",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254794064557",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "on",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'on',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://echo_javx_user:OmmkSICb42IvTm9N8bLrdDT8MwGKHPa7@dpg-cs9n0h3qf0us739j1grg-a.oregon-postgres.render.com/echo_javx"
        : "postgresql://echo_javx_user:OmmkSICb42IvTm9N8bLrdDT8MwGKHPa7@dpg-cs9n0h3qf0us739j1grg-a.oregon-postgres.render.com/echo_javx",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
