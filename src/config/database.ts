export default {
  host: process.env.DB_HOST,
  type: 'mysql',
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [process.env.DB_ENTITIES],
  synchronize: process.env.DB_SYNCRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  migrationsDir: [process.env.DB_MIGRATIONS_DIR],
};
