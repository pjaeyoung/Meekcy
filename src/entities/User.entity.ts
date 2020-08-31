import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
	ManyToMany,
} from 'typeorm';
import { Avatar } from './Avatar.entity';
import { Room } from './Room.entity';
import { Message } from './Message.entity';
import { VideoHistory } from './VideoHistory.entity';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	nickname!: string;

	@Column({ name: 'sns_id' })
	snsId!: string;

	@ManyToOne((type) => Avatar, (avatar) => avatar.users, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'avatar_id' })
	avatar!: Avatar;

	@ManyToOne((type) => Room, (room) => room.users, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'room_id' })
	room!: Room;

	@OneToMany((type) => Message, (message) => message.user)
	messages!: Message[];

	@OneToMany((type) => VideoHistory, (videoHistory) => videoHistory.user)
	videoHistories!: VideoHistory[];
}
