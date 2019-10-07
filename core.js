const Discord = require('discord.js');
const client = new Discord.Client({
  disableEveryone: true
});
const mysql = require('mysql');
const Enmap = require('enmap')
const fs = require('fs');
client.config = require('./config.json');
client.prefix = client.config.prefix;
client.commands = new Enmap();
const prefix = client.prefix;
const config = client.config;
const {
  TOKEN
} = config;

const con = mysql.createConnection({
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE
});

con.connect(err => {
  if (err) throw err;
  console.log("Подключен к базе данных!")
})
client.con = con;

client.on('ready', () => {
  console.log('%s is ready', client.user.tag);
  client.generateInvite(8).then(i => console.log(i))
})
fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });
});
client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.channel.type == 'dm') return;
  let commandfile = client.commands.get(command);
  if (commandfile) commandfile.run(client, message, args);

})

client.login(TOKEN);
