const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play a song from YouTube.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('Searches for a song and plays it')
        .addStringOption((option) =>
          option
            .setName('searchterms')
            .setDescription('search keywords')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('playlist')
        .setDescription('Plays a playlist from YT')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('Plays a single song from YT')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription("the song's url")
            .setRequired(true)
        )
    ),
  execute: async (interaction, client) => {
    console.log('Executing play command...');
    console.log('Interaction:', interaction);
    console.log('Interaction Guild:', interaction.guild);

    if (!interaction.guild) {
      return interaction.reply('This command can only be used in a server.');
    }

    if (!interaction.member) {
      interaction.member = await interaction.guild.members.fetch(
        interaction.user.id
      );
    }

    if (!interaction.member.voice.channel)
      return interaction.reply(
        'You need to be in a Voice Channel to play a song.'
      );

    let queue = await client.player.nodes.create(interaction.guild);
    if (!queue.connection)
      queue = await queue.connect(interaction.member.voice.channel);

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === 'song') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) return interaction.reply('No results');
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed = embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === 'playlist') {
      let url = interaction.options.getString('url');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.reply(`No playlists found with ${url}`);
      const playlist = result.playlist;
      await queue.addTracks(result.tracks);
      embed = embed
        .setDescription(
          `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === 'search') {
      let searchterms = interaction.options.getString('searchterms');
      const result = await client.player.search(searchterms, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) return interaction.reply('No results');
      const song = result.tracks[0];
      await queue.addTrack(song);
      embed = embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    await interaction.reply({ embeds: [embed] });
    if (!queue.isPlaying()) {
      const firstTrack = queue.tracks.at(0); // Get the first track directly
      if (!firstTrack) {
        console.error('No tracks in the queue to play.');
        return interaction.followUp(
          'An error occurred while trying to play the song.'
        );
      }
      await queue.node.play(firstTrack); // Play the first track
      console.log(`Playing: ${firstTrack.title}`);
    }
  },
  catch(error) {
    console.error('Error in play command:', error); // Log the full error
    interaction.followUp('An error occurred while trying to play the song.');
  },
};
