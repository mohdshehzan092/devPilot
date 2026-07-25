import { Allow, IsString } from 'class-validator';

export class ModifyBodyDto {
  @Allow()
  body: any;

  @IsString()
  instruction!: string;
}