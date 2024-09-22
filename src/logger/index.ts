import winston from 'winston';

// Створюємо формат логування
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

console.log(__dirname);
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    new winston.transports.File({
      filename: 'combined.log',
      dirname: 'logs',
      format: logFormat,
    }),
    new winston.transports.File({
      filename: 'error.log',
      dirname: 'logs',

      level: 'error',
      format: logFormat,
    }),
  ],
});

export default logger;
