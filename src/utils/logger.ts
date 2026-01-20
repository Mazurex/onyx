import { createLogger, format, transports } from 'winston'
import chalk from 'chalk'
import util from 'util'

const levelColors: Record<string, (text: string) => string> = {
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red.bold,
    debug: chalk.cyan,
    http: chalk.magenta,
}

const customFormat = format.printf(({ timestamp, level, message, ...meta }) => {
    const color = levelColors[level] || ((text: string) => text)
    const time = chalk.gray(`[${timestamp}]`)
    const lvl = color(level.toUpperCase().padEnd(5, ' '))
    const metaString = Object.keys(meta).length
        ? chalk.whiteBright(util.inspect(meta, { depth: null, colors: false }))
        : ''
    return `${time} ${lvl}: ${message} ${metaString}`
})

export const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.splat(),
        customFormat
    ),
    transports: [new transports.Console()],
})
