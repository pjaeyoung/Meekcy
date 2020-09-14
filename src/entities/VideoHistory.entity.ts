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
import { VideoHistoryOption } from '../interfaces/Video.interface';
import { debugINFO } from '../utils/debug';

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

	static UpdateOrCreate = async (option: VideoHistoryOption): Promise<void> => {
		const { videoId, userId, endTime } = option;

		const video = await Video.findOne({ id: videoId });
		// DB에 video 존재하지 않을 경우 예외처리
		if (video == undefined) {
			throw Error('RequestError: video_id');
		}

		// 기존에 비디오 시청 기록 있는 지 확인
		const videoHistory = await VideoHistory.createQueryBuilder('videoHistory')
			.innerJoin('videoHistory.user', 'user')
			.innerJoin('videoHistory.video', 'video')
			.where('user.id = :userId', { userId })
			.andWhere('video.id = :videoId', { videoId })
			.getOne();

		// 기존에 비디오 시청 기록이 없으면 새로 생성하기
		if (videoHistory === undefined) {
			await VideoHistory.createQueryBuilder()
				.insert()
				.into(VideoHistory)
				.values({ user: () => `${userId}`, video: () => `${videoId}`, endTime })
				.execute();
		} else {
			// 기존 비디오 시청기록이 있는 경우 업데이트
			videoHistory.endTime = endTime;
			await videoHistory.save();
		}
	};
}
