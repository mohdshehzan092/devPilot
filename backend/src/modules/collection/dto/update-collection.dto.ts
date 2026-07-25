import { CreateCollectionDto } from "./create-collection.dto";
import { PartialType } from "@nestjs/swagger";


export class UpdateCollectionDto extends PartialType(
    CreateCollectionDto,
) {}