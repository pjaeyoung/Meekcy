import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class VideoRefactoring1600220561497 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('video', new TableColumn({ name: 'trailer', type: 'varchar' }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('video', 'trailer');
	}
}
