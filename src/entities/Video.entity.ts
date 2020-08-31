import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from './Room.entity';
import { VideoHistory } from './VideoHistory.entity';

@Entity()
export class Video extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	thumbnail!: string;

	@Column({ name: 'running_time' })
	runningTime!: number;

	@Column()
	url!: string;

	@OneToMany((type) => Room, (room) => room.video)
	rooms!: Room[];

	@OneToMany((type) => VideoHistory, (videoHistory) => videoHistory.video)
	videoHistories!: VideoHistory[];
}
