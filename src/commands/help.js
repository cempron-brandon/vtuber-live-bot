const Discord = require('discord.js')
const fs = require("fs")
const {BOT_PREFIX} = require('../utils/constants')

module.exports.run = async (client, msg, args) => {
	var command = args[0];
	var commandnum = 0;
	const prefix = process.env.PREFIX;
  
	if (command) {
		try {
			var file = require(`./${command}`);
		} catch (err) {
			msg.channel.send({embed: {
				  color: 16734039,
				  description: "That command does not exist, Take a look at " + `${prefix}` + " help!"
				}
			})
		}
				
		let newembed = new Discord.MessageEmbed()
			.setTitle(":grey_question: Help - " + `${file.help.type}` + " Command", msg.guild.iconURL)
			.setColor("RANDOM")
			.setImage(client.AvatarURL)
			//.setFooter(`Bot created by ${cnf.owner}`,)
			.addField(`${BOT_PREFIX} ` + file.help.usage, file.help.description)
		  
			msg.channel.send(newembed);  
	}
  
	var done = true
	
	var General = [];
	var Youtube = [];
	console.log("aaaa!!!")
	fs.readdir("./src/commands", (err, files) => {
		console.log(files)
		if (err) return;
		commandnum = files.length;
		console.log(commandnum)
		files.forEach(file => {
			let f = require(`./${file}`);
			var namelist = f.help.name;
			var desclist = f.help.description;
			var usage = f.help.usage;
			var type = f.help.type;
		
			if (type == "General") General.push([namelist, desclist, usage]);
			if (type == "Youtube") Youtube.push([namelist, desclist, usage]);
			// if (namelist == "userinfo") {
			//   done = true
			// }      
	  	});
		console.log("HELLO!!!")
		if (done) {
			if (!command) {
				msg.channel.send({embed: {
					color: 3447003,
					description: "Generating the help..."
				}}).then(msg=>{
					var embed = new Discord.MessageEmbed()
						.setAuthor("Help", msg.guild.iconURL)
						.setColor("RANDOM")
						.setImage(client.AvatarURL)          
						.addField(":bricks: General", General.map((roles => roles[0])).join(", ") || `No commands` ,)
						.addField(":arrow_forward: Youtube", Youtube.map((roles => roles[0])).join(", ") || `No commands` ,)
						.addField(":grey_question: Command Information", `${BOT_PREFIX}` + " help <command>")
						//.setFooter(`Commands for Owner: ` + Owner.map((roles => roles[0])).join(", ") + `\nBot created by ${cnf.owner} • ${commandnum} Commands`,)
					msg.edit(embed);
					msg.edit("\u200B")
				})
			} else if (err) return;
		}
	});
  }

module.exports.help = {
    name: "help",
    description: "Displays all the commands available",
    usage: "help",
    type: "General" 
}