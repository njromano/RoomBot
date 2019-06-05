var Discord = require('discord.js')
var logger = require('winston')
var auth = require('./auth.json')

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console(), { colorize: true })
logger.level = 'debug'

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
})

bot.on('ready', function(evt) {
    logger.info("Connected")
    logger.info("Logged in as:")
    logger.info(bot.username + "-(" + bot.id + ")")
})

bot.on("message", msg => {
    let messageText = msg.content
    if (messageText.substr(0,1) === "!") {
        let args = messageText.substr(1).split(" ")
        let cmd = args[0]
        args = args.splice(1)

        switch(cmd) {
            case "ping":
                msg.reply("pong!")
                break
        }
    }
})

bot.login(auth.token)