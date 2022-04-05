import databaseConfig from 'src/common/configs/database.config';

module.exports = {
  host: databaseConfig().host,
  type: 'mysql',
  port: databaseConfig().port,
  username: databaseConfig().username,
  password: databaseConfig().password,
  database: databaseConfig().database,
  synchronize: databaseConfig().synchronize,
  entities: databaseConfig().entities,
  migrations: ['src/database/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
};
