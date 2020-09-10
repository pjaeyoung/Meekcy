import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class VideoRefactoring1599107058339 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('video', new TableColumn({ name: 'title', type: 'varchar' }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('video', 'title');
	}
}
