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
import { RoomCreateCondition, CreatedRoom, FoundRoom } from '../interfaces/Room.interface';
import { Token } from '../interfaces/Auth.interface';

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

	static createAndSave = async (condition: RoomCreateCondition): Promise<CreatedRoom> => {
		const { user, videoId, end_time } = condition;
		const room = new Room();
		// DB에 유저 정보 확인
		const userRecord = await User.findOne({ id: user.id });
		if (userRecord === undefined) {
			throw Error('RequestError: user_id');
		}
		// DB에 video 정보 확인
		const videoRecord = await Video.findOne({ id: videoId });
		if (videoRecord === undefined) {
			throw Error('RequestError: video_id');
		}

		// room 정보 입력
		room.users = [userRecord];
		room.video = videoRecord;

		// DB에 저장
		await room.save();

		// 응답으로 보낼 정보 형식 맞추기
		const reformattedRoom = {
			roomname: room.roomname,
			video: { title: room.video.title, url: room.video.url, end_time },
			user: { nickname: user.nickname, avatar: user.avatar },
		};
		return reformattedRoom;
	};

	static findByRoomname = async (roomname: string, userToken: Token): Promise<FoundRoom> => {
		// roomname에 해당하는 video, message 정보 가져오기
		const room = await Room.createQueryBuilder('room')
			.where('room.roomname = :roomname', { roomname })
			.innerJoinAndSelect('room.video', 'video')
			.leftJoinAndSelect('room.messages', 'message')
			.leftJoinAndSelect('message.user', 'user')
			.leftJoinAndSelect('user.avatar', 'avatar')
			.getOne();

		// roomname에 해당하는 record가 없다면 에러 처리
		if (room === undefined) {
			throw Error('RequestError: roomname');
		}

		// 응답으로 보낼 정보 형식 맞추기
		const { iat, exp, ...user } = userToken;
		const { video, messages } = room;
		const reformattedRoom = {
			video: { title: video.title, url: video.url },
			user,
			messages,
		};

		return reformattedRoom;
	};
}
