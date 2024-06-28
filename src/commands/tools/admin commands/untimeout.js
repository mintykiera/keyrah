const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Untimeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to unmute')
        .setRequired(true)
    ),
  async execute(interaction) {
    const target = interaction.options.getMember('user');

    if (!target) {
      return await interaction.reply({
        content: 'User not found!',
        ephemeral: true,
      });
    }

    if (!target.isCommunicationDisabled()) {
      // Check if the user is actually muted
      return await interaction.reply({
        content: 'This member is not muted!',
        ephemeral: true,
      });
    }

    try {
      await target.timeout(null); // Set timeout to null to unmute
      await interaction.reply({
        content: `${target.user.tag} has been unmuted.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error unmuting member ${target.user.tag}:`, error);
      await interaction.reply({
        content: 'An error occurred while unmuting the member.',
        ephemeral: true,
      });
    }
  },
};
