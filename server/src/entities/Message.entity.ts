import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Room } from './Room.entity';
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: true })
	text!: string;

	@Column({ nullable: true })
	caption!: string;

	@CreateDateColumn({ name: 'created_at', select: false })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at', select: false })
	updatedAt!: Date;

	@ManyToOne((type) => User, (user) => user.messages, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User;

	@ManyToOne((type) => Room, (room) => room.messages, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
	room!: Room;
}
