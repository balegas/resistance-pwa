import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import GameMenu from './GameMenu'
import Game from './Game'
import GameDebug from './GameDebug'
import GameRepository, {GAME_OBJ_TYPE} from "../Model/GameRepository";
import BasicPrincipal from "../Model/BasicPrincipal";
import {msg_for_error} from "../Model/ErrorCodes"
import {withSnackbar} from 'notistack';

class Main extends Component {


    eventHandlers = {
        'update': (gameWithEvents) => {
            const {events} = gameWithEvents;
            while (this.state.eventCount < events.length) {
                this.playEvent(events[this.state.eventCount]);
                this.updateEventCount(this.state.eventCount + 1);
            }
            this.state.gameRepository.applyState(gameWithEvents);
            this.forceUpdate();
        },

        'deal': () => {
            const event = {event: 'deal', type: 'global'};
            this.updateState(event)
        },
        'select': (players) => {
            const event = {event: 'select', type: 'global', params: {players}};
            this.updateState(event);
        },
        'vote': (playerId) => {
            const event = {event: 'vote', type: 'global', params: {playerId}};
            this.updateState(event)
        },
        'all_votes': () => {
            const event = {event: 'all_votes', type: 'global', params: {}};
            this.updateState(event)
        },
        'vote_fail': () => {
            const event = {event: 'vote_fail', type: 'global', params: {}};
            this.updateState(event)
        },
        'vote_max_fail': () => {
            const event = {event: 'vote_max_fail', type: 'global', params: {}};
            this.updateState(event)
        },
        'vote_success': () => {
            const event = {event: 'vote_success', type: 'global', params: {}};
            this.updateState(event)
        },
        'vote_mission': () => {
            const event = {event: 'vote_mission', type: 'global', params: {}};
            this.updateState(event)
        },
        'all_votes_mission': () => {
            const event = {event: 'all_votes_mission', type: 'global', params: {}};
            this.updateState(event)
        },
        'next_mission': () => {
            const event = {event: 'next_mission', type: 'global', params: {}};
            this.updateState(event)
        },
        'finish': () => {
            const event = {event: 'finish', type: 'global', params: {}};
            this.updateState(event)
        },
        'rematch': () => {
            const event = {event: 'rematch', type: 'global', params: {}};
            this.updateState(event)
        },

        'error': (ErrorCode, Params) => {
            console.log(msg_for_error(ErrorCode, Params));
        }
    };

    updateState = (event) => {
        this.state.gameRepository.updateState(event)
            .then(() => {
                this.forceUpdate();
                console.log("Saved new state")
            })
            .catch(error => msg_for_error(error))
    };

    updateGameId = gameId => this.setState({gameId});

    updatePlayerId = playerId => this.setState({playerId});

    updatePlayersIds = playersIds => this.setState({playersIds});

    updateEventCount = eventCount => this.setState({eventCount});

    enterGame = () => {
        const principal = new BasicPrincipal(this.playerId, this.playerId);
        if (principal && this.gameId) {
            this.setState({principal});
            this.repository.getOrCreateGame(principal, this.gameId, this.playersIds)
                .then(({gameId, eventCount}) => {
                    this.updateGameId(gameId);
                    this.updateEventCount(eventCount);
                })
        }
    };

    playEvent = (event) => {
        this.props.enqueueSnackbar(event.event);
        console.log(event)
    };

    constructor(props) {
        super(props);
        this.state = {
            gameRepository: new GameRepository({
                appId: 'myAppId',
                masterKey: 'myMasterKey',
                serverURL: 'http://localhost:1337/parse',
                classes: [{className: GAME_OBJ_TYPE}]
            }),
            eventCount: 0,
            principal: undefined,
            playerId: 'player1',
            gameId: 'wTAvLNbpMc',
            playersIds: ['player1', 'player2', 'player3', 'player4', 'player5'],
            open: true
        };
    }

    get gameId() {
        return this.state.gameId;
    }

    get playerId() {
        return this.state.playerId;
    }

    get playersIds() {
        return this.state.playersIds;
    }

    get principal() {
        return this.state.principal;
    }

    get repository() {
        return this.state.gameRepository;
    }

    index() {
        return <h2>Home</h2>;
    }


    createGame() {
        return (
            <div>
                <h2>Enter Game</h2>
                <GameMenu
                    updateGameId={this.updateGameId}
                    updatePlayerId={this.updatePlayerId}
                    updatePlayersIds={this.updatePlayersIds}
                    enterGame={this.enterGame}
                    game={this.state}
                ></GameMenu>
            </div>
        )
    }

    gamePanel() {
        return (
            <div>
                <Game gameRepository={this.state.gameRepository}
                      eventHandlers={this.eventHandlers}
                      gameId={this.gameId}
                      player={this.principal}
                      players={this.playersIds}
                ></Game>
            </div>
        )
    }

    debugPanel() {
        return (
            <div>
                <GameDebug gameRepository={this.state.gameRepository}
                      eventHandlers={this.eventHandlers}
                      gameId={this.gameId}
                      player={this.principal}
                      players={this.playersIds}
                ></GameDebug>
            </div>
        )
    }


    handleClick = () => {
        this.setState({open: true});
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/new/">Enter Game</Link>
                                </li>
                                <li>
                                    <Link to="/Game/">Game</Link>
                                </li>
                                <li>
                                    <Link to="/Debug/">Debug</Link>
                                </li>
                            </ul>
                        </nav>

                        <Route path="/" exact render={() => this.index()}/>
                        <Route path="/new/" render={() => this.createGame()}/>
                        <Route path="/game/" render={() => this.gamePanel()}/>
                        <Route path="/debug/" render={() => this.debugPanel()}/>
                    </div>
                </Router>
            </div>
        )
    }
}

export default withSnackbar(Main);
