import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from './Room.entity';
import { VideoHistory } from './VideoHistory.entity';
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class Video extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	title!: string;

	@Column()
	thumbnail!: string;

	@Column({ name: 'running_time' })
	runningTime!: number;

	@Column({ name: 'release_day' })
	releaseDay!: string;

	@Column()
	detail!: string;

	@Column()
	url_720!: string;

	@Column()
	url_480!: string;

	@Column()
	url_360!: string;

	@OneToMany((type) => Room, (room) => room.video)
	rooms!: Room[];

	@OneToMany((type) => VideoHistory, (videoHistory) => videoHistory.video)
	videoHistories!: VideoHistory[];
}
