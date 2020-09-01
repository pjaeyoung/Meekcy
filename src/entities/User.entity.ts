import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import { Avatar } from './Avatar.entity';
import { Room } from './Room.entity';
import { Message } from './Message.entity';
import { VideoHistory } from './VideoHistory.entity';
import { FindUserCondition } from '../interfaces/User.interface';

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

	static findOrCreate = async (condition: FindUserCondition): Promise<[User, boolean]> => {
		const {
			where,
			defaults: { nickname, snsId },
		} = condition;

		let created = false; // 새로 생성여부
		let user;
		try {
			// avatar join하여 가져오기
			user = await User.findOne(where);
			if (user === undefined) {
				// DB에 user record 생성하기
				user = new User();
				user.nickname = nickname || '';
				user.snsId = snsId;
				user = await user.save();
				created = true;
			}
			return [user, created];
		} catch (err) {
			throw Error(err);
		}
	};
}

// avatar 이미지 default값 지정해주기
