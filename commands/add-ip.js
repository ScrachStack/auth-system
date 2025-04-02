
const { EmbedBuilder } = require('discord.js');
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var mysql = require('mysql'); 

var con = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,  
    database: config.mysql.database
  });


module.exports = {
    data: {
      name: 'add-ip',
      description: 'Add an IP to the whitelist with an optional expiry date and notes.',
      options: [
        {
          type: 3, 
          name: 'ip',
          description: 'The IP address to add',
          required: true,
        },
        {
          type: 3, 
          name: 'expiry_date',
          description: 'Expiry date for the IP (YYYY-MM-DD)',
          required: false,
        },
        {
          type: 3, 
          name: 'notes',
          description: 'Notes related to the IP',
          required: false,
        }
      ],
    },
    async execute(interaction) {
      const ip = interaction.options.getString('ip');
      const expiryDate = interaction.options.getString('expiry_date') || null;
      const notes = interaction.options.getString('notes') || '';
  
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(ip)) {
        return interaction.reply({ content: 'Invalid IP address provided!', ephemeral: true });
      }
  
      const sql = 'INSERT INTO server_licensing (ip, whitelisted, notes, expiry_date) VALUES (?, 1, ?, ?)';
      con.query(sql, [ip, notes, expiryDate], function(err, result) {
        if (err) {
          console.error(err);
          return interaction.reply({ content: 'Error inserting IP into the database.', ephemeral: true });
        }
  
        const embed = new EmbedBuilder()
          .setColor('#0099ff')
          .setTitle('IP Whitelisted')
          .setDescription(`The IP address **${ip}** has been added to the whitelist.`)
          .addFields(
            { name: 'Notes', value: notes || 'No notes provided.' },
            { name: 'Expiry Date', value: expiryDate || 'No expiry date.' }
          )
          .setTimestamp();
  
        return interaction.reply({ embeds: [embed] });
      });
    },
  };