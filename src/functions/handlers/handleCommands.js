const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

module.exports = (client) => {
  client.handleCommands = async () => {
    const commands = [];
    const toolsPath = path.join(__dirname, '..', '..', 'commands', 'tools');

    // Recursive function to read all command files
    function readCommands(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          readCommands(filePath); // Recurse into subdirectories
        } else if (file.endsWith('.js')) {
          const command = require(filePath);
          if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
          } else {
            console.log(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
            );
          }
        }
      }
    }

    readCommands(toolsPath); // Start the recursive read from the 'tools' folder

    const clientId = '1255563852037357568';
    const guildId = '1200416613019685024';
    const rest = new REST({ version: '10' }).setToken(process.env.token);

    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  };
};
