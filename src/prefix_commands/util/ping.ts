import { Message } from 'discord.js'

export const command = {
    usage: 'ping [target:user] (reason:string)',
    async execute(message: Message) {
        await message.reply('Pong!')
    },
}
