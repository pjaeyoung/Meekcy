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
import { RoomCreateCondition, FoundRoom } from '../interfaces/Room.interface';

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

	static createAndSave = async (condition: RoomCreateCondition): Promise<string> => {
		const { user, videoId } = condition;
		const room = new Room();
		// DB에 유저 정보 확인
		const userRecord = await User.findOne({ id: user.id }, { relations: ['room'] });
		if (userRecord === undefined) {
			throw Error('RequestError: user_id');
		}

		// 유저가 room에 있을 때 room 생성 막기
		if (userRecord.room !== null) {
			throw Error('already exists in room');
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

		// roomname 전달
		return room.roomname;
	};

	static findByRoomname = async (roomname: string): Promise<FoundRoom> => {
		// roomname에 해당하는 video, message 정보 가져오기
		const room = await Video.createQueryBuilder('video')
			.select(['video.title', 'video.url'])
			.innerJoin('video.rooms', 'room')
			.where('room.roomname = :roomname', { roomname })
			.getOne();

		// roomname에 해당하는 record가 없다면 에러 처리
		if (room === undefined) {
			throw Error('RequestError: roomname');
		}
		return room;
	};
}
