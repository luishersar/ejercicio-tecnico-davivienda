import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Survey } from './survey.entity';
import { Answer } from './answer.entity';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'int', name: 'survey_id' })
  surveyId: number;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true, name: 'session_info' })
  sessionInfo: Record<string, any>;

  @ManyToOne(() => Survey, (survey) => survey.responses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @OneToMany(() => Answer, (answer) => answer.response)
  answers: RTCOfferAnswerOptions[];
}
