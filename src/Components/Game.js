import React, {Component} from "react";
import Grid from '@material-ui/core/Grid';
import PlayerActions from "./PlayerActions";
import Board from "./Board";
import MissionPanel from "./MissionPanel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import images from "res/images";

export default class Game extends Component {

    stateText = {
        'build_team': 'Build team',
        'voting': 'Voting phase',
        'eval_votes': 'Decision made',
        'mission': 'Mission',
        'eval_mission': 'Mission ended',
    };

    stateDescription = {
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
            gameRepository: props.gameRepository
        };

        props.gameRepository.eventHandlers = props.eventHandlers;
    }

    get game() {
        return this.state.gameRepository.game && this.state.gameRepository.game.game;
    }

    renderPlayer = () => {
        let isLeader = this.game.isLeader(this.props.player.id);
        let playerImg = this.game.getImageForPlayer(this.props.player.id);
        return (<Box display="flex" flexWrap="wrap" flexDirection="row">
            <Box>
                <img width={200} src={images[playerImg]} alt='Player Faction'></img>
                <Typography>Player Faction</Typography>
            </Box>
            <Box style={{marginLeft: 10}}>
                {isLeader && <img width={200} src={images.leader} alt='Leader'></img>}
                {!isLeader && <Typography>{'Leader is '+this.game.leader}</Typography>}
            </Box>
        </Box>)
    };

    render() {
        if (!this.game) {
            return (<div>{'Game Not started'}</div>);
        }
        return (
            <div>
                <PlayerActions
                    game={this.game}
                    player={this.props.player}
                    players={this.props.players}
                />
                <Grid item xs={12}>
                    <Paper>{`Scores: ${JSON.stringify(this.game.players)}`}</Paper>
                </Grid>
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

                </Grid>
                <Grid container spacing={0}>
                    <Grid item style={{marginLeft: 30}}>
                        {this.renderPlayer()}
                    </Grid>
                </Grid>
            </div>
        );
    }
}
