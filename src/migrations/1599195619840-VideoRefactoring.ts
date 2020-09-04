import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class VideoRefactoring1599195619840 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('video', new TableColumn({ name: 'release_day', type: 'varchar' }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('video', 'release_day');
	}
}
