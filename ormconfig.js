module.exports = [
	{
		type: 'mysql',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.NODE_ENV === 'test' ? 'meekcy_test' : process.env.DB_NAME,
		synchronize: true,
		logging: ['error'],
		entities: ['dist/entities/*.js'],
		migrations: ['dist/migrations/*.js'],
		cli: {
			migrationsDir: 'src/migrations',
		},
	},
];
