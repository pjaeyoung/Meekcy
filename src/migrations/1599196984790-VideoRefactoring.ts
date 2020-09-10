import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class VideoRefactoring1599196984790 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('video', new TableColumn({ name: 'detail', type: ' MEDIUMTEXT' }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('video', 'detail');
	}
}
