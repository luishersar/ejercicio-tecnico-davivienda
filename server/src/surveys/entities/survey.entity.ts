import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { SurveyResponse } from './survey-response.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity('surveys')
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'bigint', name: 'userId' })
  userId: number;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'current_timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'current_timestamp',
  })
  updatedAt: Date;

  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @OneToMany(() => SurveyResponse, (response) => response.survey)
  responses: SurveyResponse[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
