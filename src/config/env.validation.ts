/**
 * Environment Variables Validation Schema
 * Uses Joi to enforce that all required environment variables are present and correctly typed
 * before the application can start. This prevents runtime errors due to missing configurations.
 */
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Application Environment (e.g., development, production)
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'), // Defaults to development if not specified
    
  // Port number the application will listen on
  PORT: Joi.number().default(3000),
  
  // --- Database Configurations ---
  DB_HOST: Joi.string().required(), // Database hostname or IP
  DB_PORT: Joi.number().default(5432), // Database port (default Postgres port)
  DB_USER: Joi.string().required(), // Database username
  DB_PASSWORD: Joi.string().allow(''), // Database password (can be empty for local dev)
  DB_NAME: Joi.string().required(), // Database name
  
  // --- JWT Configurations ---
  JWT_SECRET: Joi.string().required(), // Secret key used to sign JWT tokens
  JWT_EXPIRATION_TIME: Joi.string().default('1d'), // Token lifespan (e.g., 1 day)
});
