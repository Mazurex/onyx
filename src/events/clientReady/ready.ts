import { Client } from 'discord.js'
import { logger } from '../../utils/logger'

export const event = {
    once: true,
    async execute(client: Client) {
        logger.info(`Ready! Logged in as ${client.user?.tag}`)
    },
}
