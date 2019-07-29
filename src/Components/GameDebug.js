import React, {Component} from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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

export default class GameDebug extends Component {

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

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper style={style.paper}>{`Scores: ${JSON.stringify(this.game.players)}`}</Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper style={style.paper}>{`Current phase: ${this.game.currentState}`}</Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper style={style.paper}>{`Assignees: ${this.game.round.assignees}`}</Paper>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={6}>
                        <Paper
                            style={style.paper}>{`Number of Success: ${JSON.stringify(this.game.countSuccess)}`}</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            style={style.paper}>{`Total missions: ${this.game.currentMission}/${this.game.state.rules.numRounds}`}</Paper>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`Number of infiltrates: ${JSON.stringify(this.game.rules.axisPerPlayers)}`}</Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`Leader: ${this.game.getPlayerByIdx(this.game.round.leader)}`}</Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`My role: ${this.game.getRole(this.props.player.id)}`}</Paper>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`Current mission: ${JSON.stringify(this.game.currentMission + 1)}`}</Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`Number of participants in round: ${JSON.stringify(this.game.requiredAssignees)}`}</Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper
                            style={style.paper}>{`Number of failed attempts in round: ${JSON.stringify(this.game.failedAttempts)}`}</Paper>
                    </Grid>
                </Grid>
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={6}>
                        <Paper
                            style={style.paper}>{`Votes: ${Object.keys(this.game.round.votes)}`}</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper
                            style={style.paper}>{`Mission Votes: ${Object.keys(this.game.round.mission)}`}</Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Paper style={style.paper}>{`Dump: ${JSON.stringify(this.game)}`}</Paper>
                </Grid>
            </Grid>

        );
    }
}
