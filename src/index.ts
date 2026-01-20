import { Client, GatewayIntentBits, User } from 'discord.js'
import 'dotenv/config'

import { eventHandler } from './handlers/event'
import { slashCommandHandler } from './handlers/slashCommand'
import { SlashCommandType } from './types/SlashCommand'
import { prefixCommandHandler } from './handlers/prefixCommand'
import { PrefixCommandType } from './types/PrefixCommand'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
eventHandler(client)
export const slash_commands: SlashCommandType | void = slashCommandHandler()
export const prefix_commands: PrefixCommandType | void = prefixCommandHandler()

client.login(process.env.DISCORD_TOKEN)
