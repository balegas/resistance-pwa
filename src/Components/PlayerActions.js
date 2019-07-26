import React from 'react';
import Button from '@material-ui/core/Button';

const style = {
    backdropStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 50
    },

    modalStyle: {
        backgroundColor: '#fff',
        borderRadius: 5,
        maxWidth: 500,
        minHeight: 300,
        margin: '0 auto',
        padding: 30
    }

};


export default class PlayerActions extends React.Component {

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
    };

    evalVotes = () => {
        this.props.game.tryEvalVotes(this.playerId);
    };

    voteMission = (vote) => {
        this.props.game.tryVoteMission(this.playerId, vote);
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
        this.props.players.forEach(p => buttons.push((<Button
            key={p}
            color={this.state.assignees.includes(p) ? 'secondary' : 'primary'}
            onClick={() => toggleAssignee(p)}>
            {p}
        </Button>)));
        return ({
            action: () => this.selectAssignees(),
            text: 'Select Assignees',
            content: (<div>{buttons}</div>)
        })
    };

    voteAction = () => {
        return ({
            content:
                (<div>
                    <Button key={'vote_accept'} onClick={() => this.vote(true)}>Accept</Button>
                    <Button key={'vote_reject'} onClick={() => this.vote(false)}>Reject</Button>
                </div>)
        })
    };

    voteMissionAction = () => {
        return ({
            content:
                (<div>
                    <Button key={'vote_mission_accept'} onClick={() => this.voteMission(true)}>Accept</Button>
                    <Button key={'vote_mission_reject'} onClick={() => this.voteMission(false)}>Reject</Button>
                </div>)
        })
    };

    modals = {
        'select': this.selectAssigneesAction,
        'vote' : this.voteAction,
        'vote_mission' : this.voteMissionAction
    };

    render() {
        if (this.props.game) {
            return (
                <div>
                    <div>
                        <Button onClick={this.deal}>Deal</Button>
                        <Button onClick={this.showSelectAssignees}>Select Assignees</Button>
                        <Button onClick={this.showVote}>Vote</Button>
                        <Button onClick={this.evalVotes}>Evaluate Votes</Button>
                        <Button onClick={this.showVoteMission}>Vote Mission</Button>
                        <Button onClick={this.evalVotesMission}>Evaluate Mission</Button>
                        <Button onClick={this.rematch}>Rematch</Button>
                    </div>
                    <GameModal
                        id={this.state.open}
                        onClose={this.toggleModal}
                        modals={this.modals}
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
        if (!this.props.id) {
            return null;
        }
        const action = this.getAction(this.props.id);
        if (!action) {
            return (<div></div>);
        }
        let actionButton = (undefined);
        if (action.action) {
            actionButton = (<button onClick={action.action}>{action.text}</button>);
        }
        return (
            <div className="backdrop" style={style.backdropStyle}>
                <div className="modal" style={style.modalStyle}>
                    {action.content}
                    <div className="footer">
                        <button onClick={this.props.onClose}>Close</button>
                        {actionButton}
                    </div>
                </div>
            </div>
        );
    }
}
