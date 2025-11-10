import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SurveyResponse } from './survey-response.entity';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'responseId' })
  responseId: number;

  @Column({ type: 'int', name: 'questionId' })
  questionId: number;

  @Column({ type: 'text', name: 'value' })
  value: string;

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

  @ManyToOne(() => SurveyResponse, (response) => response.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'responseId' })
  response: SurveyResponse;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
