module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand() && interaction.guild) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Something went wrong while trying to execute this command :(`,
          ephemeral: true,
        });
      }
    } else {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        ephemeral: true,
      });
    }
  },
};
