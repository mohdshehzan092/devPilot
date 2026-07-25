import { IsObject } from 'class-validator';

export class SummarizeResponseDto {
  @IsObject()
  response!: any;
}