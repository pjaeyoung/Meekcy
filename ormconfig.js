module.exports = {
	type: 'mysql',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: ['query', 'error'],
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/**/*.migration.js'],
	subscribers: ['dist/**/*.subscriber.js'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};
