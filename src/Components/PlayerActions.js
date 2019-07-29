import React from 'react';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import images from "res/images";
import {withStyles} from "@material-ui/styles";
import {CardElement} from "../Elements/CardElements";

const style = {

    button: {
        margin: 10
    },

    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 50,
        zIndex: 999,
        height: '100%'

    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 5,
        width: 600,
        minHeight: 300,
        margin: '0 auto',
        padding: 30,
    }
};

class PlayerActions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            modalContent: undefined,
            assignees: []
        }
    }

    get playerId() {
        return this.props.player.id;
    }

    get assignees() {
        return this.state.assignees;
    }

    toggleModal = (id) => {
        this.setState({
            open: this.state.open === id ? undefined : id
        });
    };

    showSelectAssignees = () => {
        this.toggleModal('select');
    };

    showVote = () => {
        this.toggleModal('vote');
    };

    showVoteMission = () => {
        this.toggleModal('vote_mission');
    };

    deal = () => {
        this.props.game.tryDeal(this.playerId);
    };

    selectAssignees = () => {
        this.props.game.trySelectAssignees(this.playerId, this.assignees);
    };

    vote = (vote) => {
        this.props.game.tryVote(this.playerId, vote);
        this.toggleModal();
    };

    evalVotes = () => {
        this.props.game.tryEvalVotes(this.playerId);
    };

    voteMission = (vote) => {
        this.props.game.tryVoteMission(this.playerId, vote);
        this.toggleModal();
    };

    evalVotesMission = () => {
        this.props.game.tryEvalVotesMission(this.playerId);
    };

    rematch = () => {
        this.props.game.rematch(this.playerId);
    };


    selectAssigneesAction = () => {

        const toggleAssignee = (playerId) => {
            const {assignees} = this.state;
            const idx = assignees.indexOf(playerId);
            if (idx >= 0) {
                this.assignees.splice(idx);
            } else {
                this.assignees.push(playerId);
            }
            this.setState({
                assignees: assignees,
            })
        };
        const buttons = [];
        this.props.players.forEach(p => buttons.push((
            <Button
                key={p}
                color={this.state.assignees.includes(p) ? 'secondary' : 'primary'}
                onClick={() => toggleAssignee(p)}
                style={style.button}
                >
                {CardElement(p, this.state.assignees.includes(p))}
            </Button>)));
        return ({
            content: (
                <Box>
                    <Box>{buttons}</Box>
                    <Box className="footer">
                        <Button onClick={this.toggleModal}>Close</Button>
                        <Button onClick={() => this.selectAssignees()}>{'Select Assignees'}</Button>
                    </Box>
                </Box>)
        })
    };

    voteAction = () => {
        return ({
            content:
                (<Box>
                    <ButtonBase key={'vote_accept'} style={style.card} onClick={() => this.vote(true)}>
                        <img width={300} src={images.support} alt='accept'></img>
                    </ButtonBase>
                    <ButtonBase key={'vote_reject'} style={style.card} onClick={() => this.vote(false)}>
                        <img width={300} src={images.reject} alt='reject'></img>
                    </ButtonBase>
                </Box>)
        })
    };

    voteMissionAction = () => {
        return ({
            content:
                (<Box>
                    <ButtonBase key={'vote_mission_accept'} style={style.card} onClick={() => this.voteMission(true)}>
                        <img width={300} src={images.succeed} alt='accept'></img>
                    </ButtonBase>
                    <ButtonBase key={'vote_mission_reject'} style={style.card} onClick={() => this.voteMission(false)}>
                        <img width={300} src={images.fail} alt='reject'></img>
                    </ButtonBase>
                </Box>)
        })
    };

    modals = {
        'select': this.selectAssigneesAction,
        'vote': this.voteAction,
        'vote_mission': this.voteMissionAction
    };

    render() {
        if (this.props.game) {
            return (
                <div>
                    <div>
                        <Button style={style.button} variant="contained" color="primary" m={1}
                                onClick={this.deal}>Deal</Button>
                        <Button style={style.button} variant="contained" color="primary"
                                onClick={this.showSelectAssignees}>Select
                            Assignees</Button>
                        <Button style={style.button} variant="contained" color="primary"
                                onClick={this.showVote}>Vote</Button>
                        <Button style={style.button} variant="contained" color="primary" onClick={this.evalVotes}>Evaluate
                            Votes</Button>
                        <Button style={style.button} variant="contained" color="primary" onClick={this.showVoteMission}>Vote
                            Mission</Button>
                        <Button style={style.button} variant="contained" color="primary"
                                onClick={this.evalVotesMission}>Evaluate
                            Mission</Button>
                        <Button style={style.button} variant="contained" color="primary"
                                onClick={this.rematch}>Rematch</Button>
                    </div>
                    <GameModal
                        id={this.state.open}
                        onClose={this.toggleModal}
                        modals={this.modals}
                        classes={this.props.classes}
                    >
                    </GameModal>
                </div>
            );
        }
        return (<div></div>);
    }

}

class GameModal extends React.Component {
    getAction = (id) => {
        if (!this.props.modals[id]) return undefined;
        const contentFun = this.props.modals[id];
        return contentFun && contentFun()
    };

    render() {
        const {classes} = this.props;
        if (!this.props.id) {
            return null;
        }
        const action = this.getAction(this.props.id);
        if (!action) {
            return (<div></div>);
        }
        return (
            <div className={classes.backdrop} onClick={this.props.onClose}>
                <div className={classes.modal} onClick={(event) => event.stopPropagation()}>
                    {action.content}
                </div>
            </div>
        );
    }
}

export default withStyles(style, {withTheme: true})(PlayerActions);