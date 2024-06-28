const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clears a specified number of messages from a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The number of messages to clear')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `Cleared ${amount} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
      await interaction.reply({
        content: 'An error occurred while clearing messages.',
        ephemeral: true,
      });
    }
  },
};
