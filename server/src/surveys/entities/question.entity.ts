import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from './survey.entity';
import { QuestionOption } from './question-option.entity';
import { Answer } from './answer.entity';
import { QuestionType } from '../../common/utils/enums/question-type.enum';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ default: true })
  active: boolean;

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

  @ManyToOne(() => Survey, (survey) => survey.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'surveyId' })
  survey: Survey;

  @OneToMany(() => QuestionOption, (option) => option.question, {
    cascade: true,
  })
  options: QuestionOption[];

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
