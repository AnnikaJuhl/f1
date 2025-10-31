require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const fetchRaces = require('./utils/racefetch');
const sendReminders = require('./reminders/racereminder.js');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
 });
client.commands = new Collection();

const eventsPath = path.join(__dirname, 'event-handling');
const commandsPath = path.join(__dirname, 'slash-commands');

client.on('ready', () => {
  console.log('Going for the gap!');
});

sendReminders(client);

setInterval(() => {
  console.log('Rechecking for updates');
  sendReminders(client);
}, 10 * 60 * 1000);

const { loadFiles } = require('./utils/fileloader');
const { log } = require('node:console');

const commandFiles = loadFiles(commandsPath);
for (const file of commandFiles) {
  const command = require(file);
  if (!command?.data || !command.data.name || typeof command.execute !== 'function') {
    console.warn(`[BLACK FLAG] Skipping invalid command file: ${file}`);
    continue;
  }
  client.commands.set(command.data.name, command);
}

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (!event.name || typeof event.execute !== 'function') {
      console.log(`[BLACK FLAG] Event at ${filePath} is missing requirements`);
    } else {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
}

require('./deploy-commands.js');
client.login(process.env.TOKEN);
