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

@Entity()
export class Message extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: true })
	text!: string;

	@Column({ nullable: true })
	caption!: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;

	@ManyToOne((type) => User, (user) => user.messages, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user!: User;

	@ManyToOne((type) => Room, (room) => room.messages, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'room_id' })
	room!: Room;
}
