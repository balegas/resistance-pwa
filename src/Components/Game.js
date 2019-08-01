import React, {Component} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PlayerActions from "./PlayerActions";
import Board from "./Board";
import MissionPanel from "./MissionPanel";
import Players from "./Players";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

export default class Game extends Component {

    stateText = {
        'init': 'New Game',
        'build_team': 'Build team',
        'voting': 'Voting phase',
        'eval_votes': 'Decision made',
        'mission': 'Mission',
        'eval_mission': 'Mission ended',
    };

    stateDescription = {
        'init': 'Leader deals cards',
        'build_team': 'Leader selects mission assignees',
        'voting': 'Players vote to accept Assignees.',
        'eval_votes': 'Leader evaluates votes',
        'mission': 'Players vote on the success of mission.',
        'eval_mission': 'Leader evaluates mission success'
    };


    constructor(props) {
        super(props);
        if (!props.gameRepository) throw new Error('Game not initialized');
        this.state = {
            gameRepository: props.gameRepository,
            drawer: false,
        };

        props.gameRepository.eventHandlers = props.eventHandlers;
    }

    get game() {
        return this.state.gameRepository.game && this.state.gameRepository.game.game;
    }

    render() {
        if (!this.game) {
            return (<div>{'Game Not started'}</div>);
        }
        return (
            <Box>
                <Grid>
                    <Grid item>
                        <Typography align="center" component="h1" variant="h2" color="textPrimary">
                            {this.stateText[this.game.currentState]}
                        </Typography>
                        <Typography align="center" component="h5" color="textPrimary">
                            {" " + this.stateDescription[this.game.currentState]}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <Board missions={this.game.missions}></Board>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <MissionPanel game={this.game}></MissionPanel>
                    </Grid>
                </Grid>
                <PlayerActions
                    game={this.game}
                    player={this.props.player}
                    players={this.props.players}
                    drawer={this.state.drawer}
                />
                <SwipeableDrawer anchor="right" open={this.props.playersDrawer}
                                 onClose={this.props.togglePlayersDrawer(false)}>
                    <Players players={this.game.players} leader={this.game.leader}></Players>
                </SwipeableDrawer>
            </Box>

        );
    }
}
