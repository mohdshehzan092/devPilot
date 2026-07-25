import { MongooseModule } from "@nestjs/mongoose";
import { Collection, CollectionSchema } from "./schemas/collection.schema";
import { WorkspaceModule } from "../workspace/workspace.module";
import { CollectionRepository } from "./repositories/collection.repository";
import { Module } from "@nestjs/common";
import { CollectionController } from "./controllers/collection.controller";
import { CollectionService } from "./services/collection.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Collection.name,
            schema: CollectionSchema},
        ]),
        WorkspaceModule
    ],
    controllers: [CollectionController],
    providers: [
        CollectionRepository,
        CollectionService
    ],
    exports: [
    CollectionRepository,
  ],
})

export class CollectionModule {}