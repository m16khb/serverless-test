import { BoardsRepository } from './boards.repository';

describe('BoardsRepository', () => {
  it('should be defined', () => {
    expect(new BoardsRepository()).toBeDefined();
  });
});
