import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { PresenceModule } from "./presence/presence.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { CapacityViewModule } from "./capacity-view/capacity-view.module";
import { MailerModule } from "./mailer/mailer.module";

@Module({
    imports: [
        ServiceModule,
        PresenceModule,
        FavoritesModule,
        CapacityViewModule,
        MailerModule
    ],
})
export class UserServiceModule {}
