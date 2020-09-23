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
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	nickname!: string;

	@Column({ name: 'sns_id', select: false })
	snsId!: string;

	@ManyToOne((type) => Avatar, (avatar) => avatar.users, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'avatar_id' })
	avatar!: Avatar;

	@ManyToOne((type) => Room, (room) => room.users, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'room_id', referencedColumnName: 'id' })
	room!: Room | null;

	@OneToMany((type) => Message, (message) => message.user)
	messages!: Message[];

	@OneToMany((type) => VideoHistory, (videoHistory) => videoHistory.user)
	videoHistories!: VideoHistory[];

	/*
	 	@Description   유저 아바타 변경하는 함수 
	*/
	static updateProfile = async (id: number, avatar: Avatar): Promise<void> => {
		// 요청한 유저 DB에서 찾기
		const user = await User.findOne({ id });
		if (user === undefined) {
			throw Error('RequestError: user_id');
		}
		// 요청한 avatar 정보로 변경
		user.avatar = avatar;
		// DB에 반영
		await user.save();
	};

	/*
	 	@Description   기존 유저가 존재여부에 따라 생성 및 유저정보, 생성여부 반환하는 함수 
	*/
	static findOrCreate = async (condition: FindUserCondition): Promise<[User, boolean]> => {
		const {
			where,
			defaults: { nickname, snsId },
		} = condition;

		let created = false; // 새로 생성했는지 여부
		let user;
		try {
			// avatar relation 적용하여 가져오기
			user = await User.findOne(where, { relations: ['avatar'] });
			if (user === undefined) {
				// DB에서 avatar 가져오기 : 처음 생성했을 때 디폴트값 적용
				const avatar = await Avatar.findOne({ id: 1 });
				if (avatar === undefined) {
					throw Error('AvatarID 1 is not found');
				}
				// user record 생성하기
				user = new User();
				user.nickname = nickname || '';
				user.snsId = snsId;
				user.avatar = avatar;
				// DB에 반영
				user = await user.save();
				created = true;
			}
			// JWT token에 담아줄 user정보와 Status Code(200 or 201)를 결정할 created 값 반환
			return [user, created];
		} catch (err) {
			throw Error(err);
		}
	};
}
