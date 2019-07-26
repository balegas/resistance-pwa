import BaseRepository from "../Storage/BaseRepository";
import ParseDriver, {NO_OBJECT_ERROR} from "../Storage/ParseDriver";
import Game from "../Model/Game"
import ResistanceRules from "../Model/ResistanceRules"


export const GAME_OBJ_TYPE = "GameState";

export default class GameRepository {

    defaultHandlers = {};

    constructor(params, eventHandlers) {
        let repository = new BaseRepository({
            driver: ParseDriver,
            params: {
                appId: params.appId,
                masterKey: params.masterKey,
                serverURL: params.serverURL,
                classes: params.classes
            }
        });

        repository.testConnection()
            .then(() => console.log("Connected to repository"))
            .catch(error => console.log(error.toString()));

        this.state = {
            repository: repository,
            eventHandlers: eventHandlers ? eventHandlers : this.defaultHandlers,
            game: undefined,
            gameId: undefined
        }
    }

    get repository() {
        return this.state.repository;
    }

    get eventHandlers() {
        return this.state.eventHandlers;
    }

    set eventHandlers(eventHandlers) {
        this.state.eventHandlers = eventHandlers;
    }

    get gameId() {
        return this.state.gameId;
    }

    set gameId(gameId) {
        return this.state.gameId = gameId;
    }

    get game() {
        return this.state.game;
    }

    set game(game) {
        this.state.game = game;
    }

    applyState(gameWithEvents) {
        let {events, game} = gameWithEvents;
        let {success, value, error} = Game.fromState(game, this.eventHandlers);
        if (!success) throw new Error(error);
        this.game = {events, game: value};
    }

    updateState(event) {
        if (event) {
            this.game.events.push(event);
        }
        const state = {events: this.game.events, game: this.game.game.getState()};
        return this.repository.update(this.gameId, state, GAME_OBJ_TYPE);
    }

    getOrCreateGame(principal, gameId, playersIds) {
        return this.repository.get(gameId, GAME_OBJ_TYPE)
            .catch(error => {
                    if (error.code === NO_OBJECT_ERROR) {
                        let rules = new ResistanceRules(playersIds);
                        let game = new Game(playersIds, rules, this.eventHandlers);
                        let gameWithEvents = {events: [], game: game.getState()};
                        return this.repository.save(gameWithEvents, GAME_OBJ_TYPE);
                    } else {
                        return Promise.reject("Can't create game");
                    }
                }
            )
            .then(gameWithEvents => {
                let {events, game: gameState} = gameWithEvents;
                this.gameId = gameWithEvents.objectId || gameState.id;
                this.repository.subscribe(this.state.gameId, GAME_OBJ_TYPE, this.eventHandlers);
                this.applyState(gameWithEvents);
                return {gameId: this.gameId, eventCount: events.length}
            });


    }

}
