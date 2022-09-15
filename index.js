const {Client, GatewayIntentBits } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()

const fs = require("fs");

const quotes = [
    ["FUCK YOU FUCK YOU FUCK YOU FUCK YOU FUCK YOU", "Based and blacklisted", "You think this blacklist will work? Copium", "Sebastian told me to call you the N-word"],
    ["You're already on the blacklist. Kinda weirdchamp", "ruh roh, squawkward"],
    ["Cringe and whitelisted", "You're off the blacklist? That's a Jerma reference!", "Off the blacklist POGGIES!", "I'll send you down to whitelist town"],
    ["I would never put you on the blacklist king", "birdshirt"]
]

var expression = /https:\/\/twitter\.com\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }


client.on('ready', () => {
    console.log('READY TO FIX SOME TWEETS SIR!')
})



client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

    var quote = ""
	const { commandName } = interaction;

	if (commandName === 'nofx') {
        jsonReader("./blacklist.json", (err, blacklist) => {
            if (err) {
              console.log("Error reading file:", err);
              return;
            }
            if (blacklist[interaction.user.id]){
                quote = quotes[1][Math.floor(Math.random()*quotes[1].length)]
            }
            else{
                quote = quotes[0][Math.floor(Math.random()*quotes[0].length)]
            }
            blacklist[interaction.user.id] = interaction.user.username
            fs.writeFile("./blacklist.json", JSON.stringify(blacklist), err => {
              if (err) console.log("Error writing file:", err);
            });
            console.log("Added " + interaction.user.username + " to the blacklist")
            interaction.reply(quote);
        });
	}
    else if (commandName === 'fx'){
        jsonReader("./blacklist.json", (err, blacklist) => {
            if (err) {
              console.log("Error reading file:", err);
              return;
            }
            if (blacklist[interaction.user.id]){
                quote = quotes[2][Math.floor(Math.random()*quotes[2].length)]
            }
            else{
                quote = quotes[3][Math.floor(Math.random()*quotes[3].length)]
            }
            delete blacklist[interaction.user.id]
            fs.writeFile("./blacklist.json", JSON.stringify(blacklist), err => {
              if (err) console.log("Error writing file:", err);
            });
            console.log("Took " + interaction.user.username + " off the the blacklist!")
            interaction.reply(quote);
          });
    }
});

client.on('messageCreate', message => {
    const str = message.content
    var flag = 0
    if (str.match(regex)){
        try {
            const jsonString = fs.readFileSync("./blacklist.json");
            const blacklist = JSON.parse(jsonString);
            if (blacklist[message.author.id])
                flag = 1 
        } catch (err) {
            console.log(err);
            return;
        }
        if (flag)
            return
        var authorString = '<@' + message.author + '> said: '
        const tokenize = str.split(/[\s\n]+/)
        var quote = ""
        var tweets = ""
        var quoteFlag = 0
        for (var i = 0; i < tokenize.length; i++){
            if (tokenize[i].match(regex)){
                quote += " [[TWEET]]"
                var index = tokenize[i].indexOf("https://twitter.com")
                tweets += tokenize[i].substring(0,index+8) + 'fx' + tokenize[i].substring(index+8)  + '\n'
            }
            else {
                quote += " " + tokenize[i]
                quoteFlag = 1;
            }
        }
        if (quoteFlag)
            message.channel.send(authorString + quote + '\n' + tweets, {"allowedMentions": { "users" : []}} )
        else
            message.channel.send(authorString + '\n' + tweets, {"allowedMentions": { "users" : []}} )
        message.delete()
            .then(msg => console.log(`Fixed ${msg.author.username}'s tweet`))
            .catch(console.error);
    }
})

client.login(process.env.TOKEN)