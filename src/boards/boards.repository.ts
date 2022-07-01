import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk';
import { v1 } from 'uuid';

@Injectable()
export class BoardsRepository {
  private tableName: string;
  private db: DocumentClient;

  constructor() {
    this.tableName = 'boards';
    this.db = new AWS.DynamoDB.DocumentClient();
  }

  async getBoard(title: string) {
    let board: object;
    try {
      const result = await this.db
        .query({
          TableName: this.tableName,
          IndexName: 'title-index',
          KeyConditionExpression: 'title = :t',
          ExpressionAttributeValues: {
            ':t': title,
          },
        })
        .promise();
      board = result.Items;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!board) {
      throw new NotFoundException(`not found board`);
    }

    return board;
  }

  async getBoards() {
    let boards: object[];

    try {
      const result = await this.db
        .scan({
          TableName: this.tableName,
        })
        .promise();
      boards = result.Items;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!boards) {
      throw new NotFoundException(`not found board`);
    }

    return boards;
  }

  async createBoard(dto: any) {
    const { title, content } = dto;
    try {
      const result = await this.db
        .put({
          TableName: 'boards',
          Item: {
            bid: v1(),
            title: title,
            content: content,
          },
        })
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateBoard(bid: string, dto: any) {
    const { title, content } = dto;
    try {
      const result = await this.db
        .update({
          TableName: this.tableName,
          Key: { bid: bid },
          UpdateExpression: 'set title = :t, content = :c',
          ExpressionAttributeValues: {
            ':t': title,
            ':c': content,
          },
        })
        .promise();
      console.log(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteBoard(bid: string) {
    try {
      const result = await this.db
        .delete({
          TableName: this.tableName,
          Key: { bid: bid },
        })
        .promise();
      console.log(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
