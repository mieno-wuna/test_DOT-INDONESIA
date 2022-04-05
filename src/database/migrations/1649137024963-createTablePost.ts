import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTablePost1649137024963 implements MigrationInterface {
  name = 'createTablePost1649137024963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`posts\``);
  }
}
