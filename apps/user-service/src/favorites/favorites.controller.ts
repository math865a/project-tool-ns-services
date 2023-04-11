import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { favoritePatterns as patterns } from "@ns/endpoints";
import { AddFavoriteCommand } from "./commands/add-favorite.command";
import { RemoveFavoriteCommand } from "./commands/remove-favorite.command";
import { LoadFavoritesQuery } from "./queries/load-favorites.query";

@Controller()
export class FavoritesNatsController {
    constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

    @MessagePattern(patterns.getFavorites)
    async loadFavorites(uid: string) {
        return await this.queryBus.execute(new LoadFavoritesQuery(uid));
    }

    @MessagePattern(patterns.addFavorite)
    async addFavorite(@Payload("recordId") recordId: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(
            new AddFavoriteCommand(recordId, uid)
        );
    }

    @MessagePattern(patterns.removeFavorite)
    async removeFavorite(@Payload("recordId") recordId: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(
            new RemoveFavoriteCommand(recordId, uid)
        );
    }
}
