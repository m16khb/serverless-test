import { Injectable } from '@nestjs/common';
import { BoardsRepository } from './boards.repository';

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  async getBoard(title: string) {
    return await this.boardsRepository.getBoard(title);
  }

  async getBoards() {
    return await this.boardsRepository.getBoards();
  }

  async createBoard(dto: any) {
    return await this.boardsRepository.createBoard(dto);
  }

  async updateBoard(bid: string, dto: any) {
    return await this.boardsRepository.updateBoard(bid, dto);
  }

  async deleteBoard(bid: string) {
    return await this.boardsRepository.deleteBoard(bid);
  }
}
