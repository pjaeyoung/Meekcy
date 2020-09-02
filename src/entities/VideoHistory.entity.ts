import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Video } from './Video.entity';
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class VideoHistory extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ name: 'end_time' })
	endTime!: number;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@ManyToOne((type) => User, (user) => user.videoHistories, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User;

	@ManyToOne((type) => Video, (video) => video.videoHistories, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'video_id' })
	video!: Video;
}
