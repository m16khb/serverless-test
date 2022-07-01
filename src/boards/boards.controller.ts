import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly boardsService: BoardsService,
  ) {}

  @Get('/:title')
  async getBoard(@Param('title') title: string, @Res() res: any) {
    const board = await this.boardsService.getBoard(title);
    return (
      res
        // .header({
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'GET',
        // })
        .status(HttpStatus.OK)
        .json(board)
    );
  }

  @Get()
  async getBoards(@Res() res: any) {
    this.printWinstonLog('test');
    const boards = await this.boardsService.getBoards();
    return (
      res
        // .header({
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'GET',
        // })
        .status(HttpStatus.OK)
        .json(boards)
    );
  }

  @Post()
  async createBoard(@Body() dto: any, @Res() res: any) {
    const result = await this.boardsService.createBoard(dto);
    return (
      res
        // .header({
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'POST',
        // })
        .status(HttpStatus.CREATED)
        .json(result)
    );
  }

  @Put('/:bid')
  async updateBoard(
    @Param('bid') bid: string,
    @Body() dto: any,
    @Res() res: any,
  ) {
    const result = await this.boardsService.updateBoard(bid, dto);
    return (
      res
        // .header({
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'PUT',
        // })
        .status(HttpStatus.NO_CONTENT)
        .json(result)
    );
  }

  @Delete('/:bid')
  async deleteBoard(@Param('bid') bid: string, @Res() res: any) {
    const result = await this.boardsService.deleteBoard(bid);
    return (
      res
        // .header({
        //   'Access-Control-Allow-Origin': '*',
        //   'Access-Control-Allow-Methods': 'DELETE',
        // })
        .status(HttpStatus.NO_CONTENT)
        .json(result)
    );
  }

  private printWinstonLog(test: string) {
    this.logger.error(test);
    this.logger.warn(test);
    this.logger.verbose(test);
    this.logger.debug(test);
  }
}
