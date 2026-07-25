import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum AuthType {
  NONE = 'NONE',
  BEARER = 'BEARER',
  BASIC = 'BASIC',
  API_KEY = 'API_KEY',
}

export interface RequestAuth {
  type: 'NONE' | 'BEARER' | 'BASIC' | 'API_KEY';
  token?: string;
  username?: string;
  password?: string;
  key?: string;
  value?: string;
  addTo?: 'HEADER' | 'QUERY';
}