import React, {Component} from "react";
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import PlayerActions from "./PlayerActions";
import Board from "./Board";
import MissionPanel from "./MissionPanel";
import Players from "./Players";

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
            drawer: false
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
            <div>

                <Grid>
                    <Container style={{margin: 10}}>
                        <Typography display="inline" component="h1" variant="h2" align="center" color="textPrimary">
                            {this.stateText[this.game.currentState]}
                        </Typography>
                        <Typography display="inline" component="span" align="justify" color="textPrimary">
                            {" " + this.stateDescription[this.game.currentState]}
                        </Typography>
                    </Container>
                </Grid>
                <Grid container spacing={0} justify="flex-start">
                    <Grid item>
                        <Board missions={this.game.missions}></Board>
                    </Grid>
                    <Grid item>
                        <MissionPanel game={this.game}></MissionPanel>
                    </Grid>
                    <Grid item>
                        <Players players={this.game.players} leader={this.game.leader}></Players>
                    </Grid>

                </Grid>
                <PlayerActions
                    game={this.game}
                    player={this.props.player}
                    players={this.props.players}
                    drawer={this.state.drawer}
                />
            </div>
        );
    }
}
