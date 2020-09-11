import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class VideoRefactoring1599740423362 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('video', 'url');
		await queryRunner.addColumn('video', new TableColumn({ name: 'url_720', type: 'varchar' }));
		await queryRunner.addColumn('video', new TableColumn({ name: 'url_480', type: 'varchar' }));
		await queryRunner.addColumn('video', new TableColumn({ name: 'url_360', type: 'varchar' }));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('video', new TableColumn({ name: 'url', type: 'varchar' }));
		await queryRunner.dropColumn('video', 'url_720');
		await queryRunner.dropColumn('video', 'url_480');
		await queryRunner.dropColumn('video', 'url_360');
	}
}
