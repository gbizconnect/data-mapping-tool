import { Module } from "@nestjs/common";
//import { AppController } from "./app.controller";
//import { AppService } from "./app.service";
import { DataMappingModule } from "./data-mapping/data-mapping.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    DataMappingModule,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
      exclude: ["/api/(.*)"],
      serveStaticOptions: {
        fallthrough: false,
        redirect: false,
      },
    }),
  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
