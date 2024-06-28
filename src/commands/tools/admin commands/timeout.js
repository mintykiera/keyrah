const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const durationOptions = [
  { name: '10 Minutes', value: 10 * 60 }, // in seconds
  { name: '30 Minutes', value: 30 * 60 },
  { name: '1 Hour', value: 60 * 60 },
  { name: '6 Hours', value: 6 * 60 * 60 },
  { name: '1 Day', value: 24 * 60 * 60 },
  { name: '1 Week', value: 7 * 24 * 60 * 60 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member for a specified duration')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to mute')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration of the mute (default: 10 Minutes)')
        .setChoices(...durationOptions)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for the mute')
        .setRequired(false)
    ),
  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const duration = interaction.options.getInteger('duration') || 10 * 60; // Default to 10 minutes
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return await interaction.reply({
        content: 'User not found!',
        ephemeral: true,
      });
    }

    if (!target.moderatable) {
      return await interaction.reply({
        content: 'I cannot mute this member!',
        ephemeral: true,
      });
    }

    try {
      await target.timeout(duration * 1000, reason); // Timeout in milliseconds
      await interaction.reply({
        content: `${target.user.tag} has been muted for ${
          duration / 60
        } minutes. Reason: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error muting member ${target.user.tag}:`, error);
      await interaction.reply({
        content: 'An error occurred while muting the member.',
        ephemeral: true,
      });
    }
  },
};
