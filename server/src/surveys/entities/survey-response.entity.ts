import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from './survey.entity';
import { Answer } from './answer.entity';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'surveyId' })
  surveyId: number;

  @Column({ type: 'jsonb', nullable: true, name: 'sessionInfo' })
  sessionInfo: Record<string, any>;

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

  @ManyToOne(() => Survey, (survey) => survey.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @OneToMany(() => Answer, (answer) => answer.response)
  answers: RTCOfferAnswerOptions[];
}
