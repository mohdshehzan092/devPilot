import { Allow } from 'class-validator';

export class ExplainErrorDto {
  @Allow()
  error: any;
}