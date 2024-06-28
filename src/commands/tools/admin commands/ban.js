const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const durationOptions = [
  { name: '1 Month', value: 2629800 }, // Number
  { name: '3 Months', value: 7889400 },
  { name: '5 Months', value: 13149000 },
  { name: '1 Year', value: 31557600 },
  { name: 'Forever', value: 0 }, // Use 0 to represent infinity
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName('user').setDescription('The user to ban').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('Duration of the ban (default: Forever)')
        .setChoices(...durationOptions)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('The reason for the ban')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    let duration = interaction.options.getInteger('duration'); // Get the duration in seconds
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) {
      return await interaction.reply({
        content: 'User not found!',
        ephemeral: true,
      });
    }

    if (!target.bannable) {
      return await interaction.reply({
        content: 'I cannot ban this member!',
        ephemeral: true,
      });
    }

    // Convert duration to days, or null if forever
    duration = duration === 0 ? null : Math.round(duration / 86400); // 86400 seconds in a day

    try {
      await target.ban({ days: 7, reason: reason }); // Delete 7 days of messages
      if (duration) {
        setTimeout(async () => {
          await interaction.guild.members.unban(target.id); // Unban after specified duration
          await interaction.followUp({
            content: `${target.user.tag} has been unbanned after ${duration} days.`,
            ephemeral: true,
          });
        }, duration * 86400 * 1000); // Convert back to milliseconds for setTimeout
      }
      await interaction.reply({
        content: `${target.user.tag} has been banned ${
          duration ? `for ${duration} days` : 'permanently'
        }. Reason: ${reason}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error banning member ${target.user.tag}:`, error);
      await interaction.reply({
        content: 'An error occurred while banning the member.',
        ephemeral: true,
      });
    }
  },
};
