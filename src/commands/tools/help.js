const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require('discord.js');

const commandData = {
  general: [
    { name: '/ping', value: "Checks the bot's latency", inline: true },
    { name: '/invite', value: 'Invite me to your server', inline: true },
  ],
  misc: [
    { name: '/joke', value: 'Tell a random joke', inline: true },
    { name: '/dadjoke', value: 'Tell a random dad joke', inline: true },
    { name: '/hug', value: 'Hug a user', inline: true },
    { name: '/kiss', value: 'Kiss a user', inline: true },
    { name: '/leaderboard', value: 'Check the leaderboard', inline: true },
  ],
  fun: [
    { name: '/tord', value: 'Start a game of Truth-or-dare', inline: true },
    { name: '/wyr', value: 'Start a game of Would you rather', inline: true },
    { name: '/nhie', value: 'Start a game of Never have I ever', inline: true },
  ],
  admin: [
    { name: '/kick', value: 'Kicks a user', inline: true },
    { name: '/ban', value: 'Bans a user', inline: true },
    { name: '/clear', value: 'Clears messages', inline: true },
    { name: '/mute', value: 'Mute a user', inline: true },
    { name: '/timeout', value: 'Timeout a user', inline: true },
    { name: '/unmute', value: 'Unmute a user', inline: true },
    { name: '/untimeout', value: 'Untimeout a user', inline: true },
  ],
  economy: [
    { name: '/balance', value: 'Check your balance', inline: true },
    { name: '/daily', value: 'Claim your daily reward', inline: true },
    { name: '/shop', value: 'Visit the shop', inline: true },
    { name: '/work', value: 'Do some work', inline: true },
    { name: '/give', value: 'Give some money to a user', inline: true },
  ],
  music: [
    { name: '/join', value: 'Have the bot join your call', inline: true },
    { name: '/leave', value: 'Have the bot leave your call', inline: true },
    { name: '/play', value: 'Play a song', inline: true },
    { name: '/pause', value: 'Pause a song', inline: true },
    { name: '/queue', value: 'Show the list of queued songs', inline: true },
    {
      name: '/playing',
      value: 'Show what song is currently playing',
      inline: true,
    },
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands')
    .addStringOption((option) =>
      option
        .setName('category')
        .setDescription('The command category you need help with')
        .setRequired(false) // Make it optional
        .addChoices(
          ...Object.keys(commandData).map((category) => ({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            value: category,
          }))
        )
    ),
  async execute(interaction) {
    const selectedCategory = interaction.options.getString('category');

    try {
      const embed = new EmbedBuilder().setTitle('Help Command').setColor(color);

      // If no category is specified, show all commands
      if (!selectedCategory) {
        embed
          .setDescription('Here are some of the commands you can use:')
          .addFields(
            Object.keys(commandData).map((category) => ({
              name: category.charAt(0).toUpperCase() + category.slice(1),
              value: commandData[category].map((cmd) => cmd.name).join(', '),
              inline: false,
            }))
          );

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId('help-menu')
          .setPlaceholder('Select a category...')
          .addOptions(
            Object.keys(commandData).map((category) => ({
              label: category.charAt(0).toUpperCase() + category.slice(1),
              value: category,
            }))
          );

        const row = new ActionRowBuilder().addComponents(selectMenu);
        const reply = await interaction.reply({
          embeds: [embed],
          components: [row],
          fetchReply: true,
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;
        const collector = reply.createMessageComponentCollector({
          filter: collectorFilter,
          time: 300000,
        });

        collector.on('collect', async (i) => {
          const selectedValue = i.values[0];
          const newEmbed = new EmbedBuilder()
            .setTitle(`Help - ${selectedValue.toUpperCase()}`)
            .setColor(0x0099ff)
            .addFields(commandData[selectedValue]);

          await i.update({ embeds: [newEmbed], components: [] }); // Remove menu after selection
        });

        collector.on('end', async (collected) => {
          selectMenu.setDisabled(true);
          await reply.edit({
            components: [row],
            content: 'This help menu has expired.',
          });
        });
      } else {
        // Specific command help
        if (!commandData[selectedCategory]) {
          return interaction.reply({
            content: 'Invalid category.',
            ephemeral: true,
          });
        }

        embed
          .setTitle(`Help - ${selectedCategory.toUpperCase()}`)
          .addFields(commandData[selectedCategory]);

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error executing help command:', error);
      await interaction.reply({
        content: 'An error occurred while displaying the help menu.',
        ephemeral: true,
      });
    }
  },
};
