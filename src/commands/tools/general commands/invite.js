const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite me to your server!'),

  async execute(interaction) {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=1255563852037357568&permissions=8&integration_type=0&scope=bot+applications.commands`;

    try {
      const embed = new EmbedBuilder()
        .setTitle('Invite Me!')
        .setURL(inviteLink)
        .setColor(0x0099ff); // You can choose any color you like

      await interaction.reply({ embeds: [embed] }); // No need for ephemeral here
    } catch (error) {
      console.error('Error sending invite link:', error);
      await interaction.reply({
        content: 'An error occurred while generating the invite link.',
        ephemeral: true,
      });
    }
  },
};
