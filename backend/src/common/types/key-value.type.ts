import { IsBoolean, IsString } from 'class-validator';

export class KeyValue {
  @IsString()
  key!: string;

  @IsString()
  value!: string;

  @IsBoolean()
  enabled!: boolean;
}