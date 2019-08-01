import React, {Component} from "react";
import GameMenu from './GameMenu'
import Game from './Game'
import GameDebug from './GameDebug'
import GameRepository, {GAME_OBJ_TYPE} from "../Repositories/GameRepository";
import BasicPrincipal from "../Model/BasicPrincipal";
import {msg_for_error} from "../Model/ErrorCodes"
import {withSnackbar} from 'notistack';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme} from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        background: {}
    }
});

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
        'next_mission': ({success}) => {
            const event = {event: 'next_mission', type: 'global', params: {success}};
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
            this.playEvent({event: msg_for_error(ErrorCode, Params)});
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

    enterGame = (game) => {
        const selectedId = game || this.gameId;
        console.log("selected id", selectedId)
        const principal = new BasicPrincipal(this.playerId, this.playerId);
        if (principal && selectedId) {
            this.setState({principal});
            this.repository.getOrCreateGame(principal, selectedId, this.playersIds)
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
                appId: process.env.APP_ID || 'resistance-server',
                masterKey: process.env.MASTER_KEY || 'masterKey',
                serverURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/parse',
                classes: [{className: GAME_OBJ_TYPE}]
            }),
            eventCount: 0,
            principal: undefined,
            playerId: 'player1',
            gameId: 'wTAvLNbpMc',
            playersIds: ['player1', 'player2', 'player3', 'player4', 'player5'],
            open: true,
            tab: 0
        };
        this.repository.list(GAME_OBJ_TYPE).then(games => this.setState({games}));
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
                />
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
                      playersDrawer={this.state.playersDrawer}
                      togglePlayersDrawer={this.togglePlayersDrawer}
                />
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
                />
            </div>
        )
    }

    handleChange = (event, newValue) => this.setState({tab: newValue});

    a11yProps = (index) => ({
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    });

    togglePlayersDrawer = (open) => event => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({playersDrawer: open});
    };

    TabPanel(props) {
        const {children, value, index, ...other} = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                <Box p={3}>{children}</Box>
            </Typography>
        );
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <AppBar position="static" style={{minWidth: 600}}>
                    <Tabs value={this.state.tab} onChange={this.handleChange} aria-label="simple tabs example">
                        <Tab label="Enter Game" {...this.a11yProps(0)} />
                        <Tab label="Game" {...this.a11yProps(1)} />
                        <Tab label="Debug" {...this.a11yProps(2)} />
                        <Tab label="Instructions (coming soon)" {...this.a11yProps(2)} />
                        <Button color="secondary" onClick={this.togglePlayersDrawer(true)}>Scores</Button>
                    </Tabs>
                </AppBar>
                <this.TabPanel value={this.state.tab} index={0}>
                    {this.createGame()}
                </this.TabPanel>
                <this.TabPanel value={this.state.tab} index={1}>
                    {this.gamePanel()}
                </this.TabPanel>
                <this.TabPanel value={this.state.tab} index={2}>
                    {this.debugPanel()}
                </this.TabPanel>
            </ThemeProvider>
        )
    }
}

export default withSnackbar(Main);
