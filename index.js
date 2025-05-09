const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs')
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var path = require('path');
const URLS = { 
    LicenseCheck: "validate-ip", 
  };

  
  var mysql = require('mysql'); 
  var con = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,  
    database: config.mysql.database
  });

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});

const ParseSourceIPOfRequest = function(req) {
    return (
        typeof req.headers['x-forwarded-for'] === 'string' 
        && req.headers['x-forwarded-for'].split(',').shift()
    ) || req.connection?.remoteAddress || req.socket?.remoteAddress || req.connection?.socket?.remoteAddress;
}

app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

const apiKeyMiddleware = (req, res, next) => {
  const key = req.query.KEY; 
  if (key === config.secret_API) {
    return next(); 
  } else {
    return res.status(403).send('Forbidden: Invalid API Key');
  }
};
app.get('/', async (req, res) => {
    let s = {
        "Active": true,
        "creator": "ScrachStack"
    }
    res.type('json').send(JSON.stringify(s, null, 4) + '\n');
});
app.get('/add-ip', apiKeyMiddleware, (req, res) => {
    res.render('add-ip.ejs'); 
  });
  app.post('/add-ip', (req, res) => {
    const ip = req.body.ip;
    const expiryDate = req.body.expiry_date;
    const notes = req.body.notes;
  
    const sql = 'INSERT INTO server_licensing (ip, whitelisted, notes, expiry_date) VALUES (?, 1, ?, ?)';
    con.query(sql, ["::ffff:"+ip, notes, expiryDate], function(err, result) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error inserting data');
      }
      res.redirect('/add-ip'); 
    });
  });
app.get('/' + URLS.LicenseCheck, (req, res) => {
    const ip = ParseSourceIPOfRequest(req); 
    con.query("SELECT * FROM server_licensing WHERE ip='" + ip + "' AND whitelisted=1;", function (err, result) {
        if (err) {
            console.error('Database error:', err);
            return res.json("ERR_500_INTERNAL_SERVER_ERROR");
        }
        if (result[0] != null) {
            const licence = result[0];
            const now = new Date();
            const expiryDate = new Date(licence.expiry_date);
            
            if (expiryDate < now) {
                console.log("License has expired.");
                res.json("ERR_400_LICENSE_EXPIRED");
            } else {
                console.log("IP Passed Check! License is valid.");
                res.json("SUCCESS_200_OK"); 
            }
        } else {
            console.log("IP failed check. License is invalid.");
            res.json("ERR_400_CONN_FAILED");
        }
    });
});
app.listen(config.port, () => {
    console.log('Server is listening on port ' + config.port);
});
if (config.bot.enabled) {
// Discord Bot
const { Client, GatewayIntentBits, ActivityType, Collection, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});
client.commands = new Collection();
const loadCommands = async () => {
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    const commands = [];
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data);
    }
    const rest = new REST({ version: '10' }).setToken(config.bot.BOT_TOKEN);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(config.bot.BOT_CLIENT_ID, config.bot.GUILD_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    loadCommands(); 
});
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
client.login( config.bot.BOT_TOKEN)
}
