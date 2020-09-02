import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Message } from './Message.entity';
import { Video } from './Video.entity';
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class Room extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@PrimaryGeneratedColumn('uuid')
	roomname!: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@OneToMany((type) => User, (user) => user.room)
	users!: User[];

	@OneToMany((type) => Message, (message) => message.room)
	messages!: Message[];

	@ManyToOne((type) => Video, (video) => video.rooms, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'video_id' })
	video!: Video;
}
