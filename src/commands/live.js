const Discord = require('discord.js')
const axios = require('axios')
const axiosRetry = require("axios-retry")
const c = require('../utils/constants')
const { dayjs } = require("../utils/time")

module.exports.run = async (client, message, args) => {
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
        if (org.trim().toLowerCase() === "hololive") {
            q = "org=Hololive"
        } else if (org.trim().toLowerCase() === "nijisanji") {
            q = "org=Nijisanji"
        }
    }   

    axiosInstance.get(`/live?${q}`).then( (res) => {
        res.data.map( async (info) => {
            if (info.status === "live") {
                const embed = new Discord.MessageEmbed()
                    .setTitle(info.title)
                    .setImage(`${c.YT_IMG_BASE_URL}${c.YT_IMG_JPG_TYPE}/${info.id}${c.YT_IMG_JPG_FILENAME}`)  
                    .setAuthor(info.channel.english_name, info.channel.photo, `${c.YOUTUBE_URL}/channel/${info.channel.id}`)
                    .setColor(`RANDOM`)
                    .setFooter(`Live Now!`)
                    .setURL(`${c.YOUTUBE_URL}/watch?v=${info.id}`)
                message.channel.send(embed);
            }
        } )
    })
}

module.exports.help = {
    name: "live",
    description: "Displays all active youtube live streams",
    usage: `live | ${c.BOT_PREFIX} live <group> e.g. ${c.BOT_PREFIX} live hololive`,
    type: "Youtube" 
}