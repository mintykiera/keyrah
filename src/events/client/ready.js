module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    setInterval(client.pickPresence, 86400 * 1000);
    console.log(`${client.user.tag} is up and running!`);
  },
};
