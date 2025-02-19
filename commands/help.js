const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Shows a list of all available commands',
    },
    async execute(interaction) {
        const commands = interaction.client.commands.map(command => {
            return `**/${command.data.name}**: ${command.data.description}`;
        }).join('\n');
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Bot Commands')
            .setDescription('Here are all the available commands:')
            .addFields(
                { name: 'Commands', value: commands || 'No commands available' }
            )
            .setTimestamp()
            .setFooter({ text: 'Use /command-name to execute a command!' });
        await interaction.reply({ embeds: [embed] });
    },
};
