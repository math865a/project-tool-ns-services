import { Module } from "@nestjs/common";
import { ServiceModule } from "@ns/service-deps";
import { PresenceModule } from "./presence/presence.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { CapacityViewModule } from "./capacity-view/capacity-view.module";
import { MailerModule } from "./mailer/mailer.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FeedbackModule } from "./feedback/feedback.module";
import { ActivityModule } from "./activity/activity.module";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_CONN),
        ServiceModule,
        PresenceModule,
        FavoritesModule,
        CapacityViewModule,
        MailerModule,
        FeedbackModule,
        ActivityModule
    ],
})
export class UserServiceModule {}
