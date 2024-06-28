const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Join the voice channel you are in'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'You must be in a voice channel to use this command!',
        ephemeral: true,
      });
    }

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    interaction.reply({
      content: `Joined ${interaction.member.voice.channel.name}!`,
    });
  },
};
