require('dotenv').config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const { Player } = require('discord-player');
const {
  SoundCloudExtractor,
  SpotifyExtractor,
  YouTubeExtractor,
} = require('@discord-player/extractor');
const { joinVoiceChannel } = require('@discordjs/voice');

const { FFmpeg } = require('@discord-player/ffmpeg');

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize collections for commands and a command array
client.commands = new Collection();
client.commandArray = [];
global.color = '#7ea7c5';

// Dynamically load functions
const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}

// Initialize the player
client.player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  },
  connectionTimeout: 30000, // Increased to 30 seconds
  leaveOnEmpty: true,
  leaveOnEnd: true,
  leaveOnStop: true,
});

client.player.on('ffmpeg', FFmpeg);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.player.on('error', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});

client.player.on('connectionError', (queue, error) => {
  console.log(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

// Register extractors
// client.player.extractors.register(SoundCloudExtractor);
// client.player.extractors.register(SpotifyExtractor);
client.player.extractors.register(YouTubeExtractor);
client.player.on('error', (queue, error) => {
  console.error(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
});
client.player.on('connectionError', (queue, error) => {
  console.error(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
});

client.player.on('error', (queue, error) => {
  console.error(
    `[${queue.guild.name}] Error emitted from the queue: ${error.message}`
  );
  // Notify the user and potentially skip to the next track
});

client.player.on('connectionError', (queue, error) => {
  console.error(
    `[${queue.guild.name}] Error emitted from the connection: ${error.message}`
  );
  // Attempt to reconnect or notify the user
});

// Handle events and commands
client.handleEvents();
client.handleCommands();

// Log in to Discord
client.login(token);

// Connect to the database
(async () => {
  connect(databaseToken).catch(console.error);
})();
