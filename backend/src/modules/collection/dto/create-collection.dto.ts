import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, IsMongoId } from "class-validator";

export class CreateCollectionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(500)
    name!: string

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsMongoId()
    workspaceId!: string;
}