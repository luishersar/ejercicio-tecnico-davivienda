import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSurveySchema1762742408341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          { name: 'name', type: 'varchar', isNullable: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'surveys',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'active', type: 'boolean', default: true },
          { name: 'userId', type: 'bigint', isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'surveys',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `CREATE INDEX "idx_surveys_user_id" ON "surveys" ("userId")`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'surveyId', type: 'integer' },
          { name: 'label', type: 'text' },
          { name: 'type', type: 'varchar', length: '50' },
          { name: 'active', type: 'boolean', default: true },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['surveyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surveys',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'question_options',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'questionId', type: 'integer' },
          { name: 'label', type: 'text' },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'question_options',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'questions',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'survey_responses',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          { name: 'surveyId', type: 'integer' },
          {
            name: 'completedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          { name: 'sessionInfo', type: 'jsonb', isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'survey_responses',
      new TableForeignKey({
        columnNames: ['surveyId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'surveys',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'answers',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          { name: 'responseId', type: 'integer' },
          { name: 'questionId', type: 'integer' },
          { name: 'value', type: 'text' },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'current_timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['responseId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'survey_responses',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'answers',
      new TableForeignKey({
        columnNames: ['questionId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'questions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('answers', true);
    await queryRunner.dropTable('survey_responses', true);
    await queryRunner.dropTable('question_options', true);
    await queryRunner.dropTable('questions', true);
    await queryRunner.dropTable('surveys', true);
    await queryRunner.dropTable('users', true);
  }
}
