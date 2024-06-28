const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers) // Requires Kick Members permission or higher
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to kick')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for the kick')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return await interaction.reply({
        content: 'User not found!',
        ephemeral: true,
      });
    }

    if (!target.kickable) {
      return await interaction.reply({
        content: 'I cannot kick this member!',
        ephemeral: true,
      });
    }

    try {
      await target.kick(reason);
      await interaction.reply({
        content: `Kicked ${target.user.tag} for reason: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error kicking member ${target.user.tag}:`, error);
      await interaction.reply({
        content: 'An error occurred while kicking the member.',
        ephemeral: true,
      });
    }
  },
};
