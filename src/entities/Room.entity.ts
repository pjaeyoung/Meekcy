import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
	Column,
	AfterInsert,
} from 'typeorm';
import { User } from './User.entity';
import { Message } from './Message.entity';
import { Video } from './Video.entity';
import convertToEncrypted from '../utils/crypto';

@Entity()
export class Room extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true, nullable: true })
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

	@AfterInsert()
	resetRoomname(): void {
		if (this.roomname === undefined || this.roomname === null) {
			this.roomname = convertToEncrypted(`${this.id}`);
		}
	}
}
