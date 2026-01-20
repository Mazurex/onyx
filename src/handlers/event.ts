import { Client } from 'discord.js'
import path from 'path'
import fs from 'fs'
import { logger } from '../utils/logger'

export function eventHandler(client: Client, eventDir: string = '../events') {
    logger.debug('[EVENT] Beginning event registration process...')
    const eventsPath = path.join(__dirname, eventDir)

    if (!fs.existsSync(eventsPath)) {
        logger.warn(`[EVENT] Could not find event directory at "${eventsPath}"`)
        return
    }

    const eventDirs = fs.readdirSync(eventsPath).filter((dir) => {
        const dirData = fs.statSync(path.join(eventsPath, dir))
        return dirData.isDirectory()
    })

    for (const eventDir of eventDirs) {
        const eventPath = path.join(eventsPath, eventDir)

        const eventFiles = fs
            .readdirSync(eventPath)
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

        for (const eventFile of eventFiles) {
            const eventFilePath = path.join(eventPath, eventFile)

            const { event } = require(eventFilePath)

            logger.debug(
                `[EVENT] Registered the event "${eventDir}" with "${eventDir}/${eventFile}"`
            )

            if (event.once) {
                client.once(eventDir, (...args) => event.execute(...args))
            } else {
                client.on(eventDir, (...args) => event.execute(...args))
            }
        }
    }

    logger.debug('[EVENT] Successfully registered all events!')
}
