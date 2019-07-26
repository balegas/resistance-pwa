import React, {Component} from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PlayerActions from "./PlayerActions";
import Board from "./Board";
import MissionPanel from "./MissionPanel";

const style = {
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: 10,
        textAlign: 'center',
        color: 'black',
    },
};

export default class Game extends Component {

    constructor(props) {
        super(props);
        if (!props.gameRepository) throw new Error('Game not initialized');
        this.state = {
            gameRepository: props.gameRepository
        };

        props.gameRepository.eventHandlers = props.eventHandlers;
    }

    get game() {
        return this.state.gameRepository.game && this.state.gameRepository.game.game;
    }

    render() {
        if (!this.game) {
            return (<div>{'Game Not started'}</div>)
        }
        return (
            <div>
                <PlayerActions
                    game={this.game}
                    player={this.props.player}
                    players={this.props.players}
                />
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={10}>
                        <Board missions={this.game.missions}></Board>
                    </Grid>
                    <Grid item xs={2}>
                        <MissionPanel currentState={this.game.currentState}></MissionPanel>
                    </Grid>

                </Grid>
            </div>
        );
    }
}
