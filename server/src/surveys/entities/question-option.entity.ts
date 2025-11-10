import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

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

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
