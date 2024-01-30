// Import the winston module for logging
import winston from 'winston';

// Create a new logger instance with specific configurations
const logger = winston.createLogger({
  level: 'info', // Set the default log level to 'info'
  format: winston.format.json(), // Define the format of the log entries as JSON
  transports: [ // Configure the transport methods for the logs
    // Log messages to the console using a simple format
    new winston.transports.Console({ format: winston.format.simple() }),
    // Log messages to a file named 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Export the logger instance for use in other parts of the application
export default logger;
