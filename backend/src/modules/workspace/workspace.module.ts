import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";

import { Workspace, WorkspaceSchema } from './schemas/workspace.schema';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { WorkspaceService } from "./services/workspace.service";
import { WorkspaceController } from "./controllers/workspace.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Workspace.name,
                schema: WorkspaceSchema,
            }
        ])
    ],
    providers: [WorkspaceRepository,
        WorkspaceService
    ],
    exports: [WorkspaceRepository,
        WorkspaceService
    ],
    controllers: [WorkspaceController],
})

export class WorkspaceModule {}