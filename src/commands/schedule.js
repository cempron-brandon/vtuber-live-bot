const Discord = require('discord.js')
const axios = require('axios')
const axiosRetry = require("axios-retry")
const c = require('../utils/constants')
const {formatDistance} = require("../utils/time")

module.exports.run = async (client, msg, args) => {
    const axiosInstance = axios.create({
        baseURL: c.HOLODEX_API_URL,
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNABORTED",
        shouldResetTimeout: true,
    });

    var org = args[0];
    let q = ""
    if (org) {
        let keyword = org.trim().toLowerCase()
        console.log(`keyword: ${keyword}`)
        console.log(`value: ${c.ORGS_NAME[keyword]}`)
        if (c.ORGS_NAME[keyword] || c.ORGS_NAME[keyword] !== undefined ) {
            q = `org=${c.ORGS_NAME[keyword]}`
        } else {
            msg.channel.send({embed: {
                color: 16734039,
                description: "That group does not exist!"
            }})
            q = `org=NONE`
            return
        }
    }   

    axiosInstance.get(`/live?${q}`).then( (res) => {
        console.log(q)
        let counter = 0;
        res.data.map( async (info) => {
            if (info.status === "upcoming") {
                counter++
                const embed = new Discord.MessageEmbed()
                    .setTitle(info.title)
                    .setImage(`${c.YT_IMG_BASE_URL}${c.YT_IMG_JPG_TYPE}/${info.id}${c.YT_IMG_JPG_FILENAME}`)  
                    .setAuthor(info.channel.english_name ? info.channel.english_name : info.channel.name, info.channel.photo, `${c.YOUTUBE_URL}/channel/${info.channel.id}`)
                    .setColor(`RANDOM`)
                    .setDescription(formatDistance(info.start_scheduled || info.available_at))
                    .setFooter(`This message will be deleted after 2 mins...`)
                    .setURL(`${c.YOUTUBE_URL}/watch?v=${info.id}`)
                msg.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 120000 /*time until delete in milliseconds*/});
                })
            }
        } )

        if ( counter === 0 ) {
            msg.channel.send({embed: {
                color: 16734039,
                description: "No upcoming live stream available at the moment!"
            }})
        }
    })
}

module.exports.help = {
    name: "schedule",
    description: "Displays all upcoming youtube live streams",
    usage: `schedule | ${c.BOT_PREFIX} schedule <group> e.g. ${c.BOT_PREFIX} schedule hololive`,
    type: "Youtube" 
}