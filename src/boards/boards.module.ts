import { Logger, Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';

@Module({
  imports: [],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, Logger],
})
export class BoardsModule {}
