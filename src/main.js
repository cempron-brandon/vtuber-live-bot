require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
const {BOT_PREFIX,COMMAND_HELP,COMMAND_LIVE} = require('./utils/constants')
const help = require('./commands/help')

client.on('ready', () => {
    console.log("Bot is now live!")
    client.user.setPresence({
        status: 'available',
        activity: {
            name: "vt help",
            type: "LISTENING"
        }
    })
})

client.on('message', msg => {
    console.log(msg.content)
    if (msg.author.bot || !msg.guild || !msg.content.startsWith(BOT_PREFIX)) return;
    if (msg.content.length >= 100) {
        return msg.channel.send({embed: {
            color: 16734039,
            description: "Command is too long!"
        }})
    }

    // if ( msg.content.startsWith(COMMAND_HELP)) {
    //     let req = msg.content.substr(COMMAND_HELP.length)
    //     let res = help.respond(req)
    //     msg.channel.send(res)
    // }

    const args = msg.content.slice(BOT_PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(args)

    try {
        let commandFile = require(`./commands/${command}.js`);
        if(commandFile.length <= 0){
            return console.log("Couldn't find any commands in /commands/ directory!");
        }
        commandFile.run(client, msg, args);
    } catch (err) {
        console.log(err);
        msg.channel.send({embed: {
                color: 16734039,
                description: "That command does not exist, Take a look at " + `${BOT_PREFIX}` + " help!"
            }})
    }
})

client.login(process.env.BOT_TOKEN)