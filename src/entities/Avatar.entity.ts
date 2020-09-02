import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User.entity';
import configs from '../common/config';

@Entity({ database: configs.DB_NAME })
export class Avatar extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	url!: string;

	@OneToMany((type) => User, (user) => user.avatar)
	users!: User[];
}
