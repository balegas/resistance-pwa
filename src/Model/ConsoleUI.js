import {
    ERROR_INVALID_PLAYER,
    ERROR_NOT_CORRECT_ASSIGNEES,
    ERROR_PLAYER_ALREADY_VOTED,
    INVALID_OPERATION
} from './ErrorCodes';

export default class ConsoleUI {
    constructor() {
        this.state = {
            eventHandlers: {}
        };
        this.registerEvent('deal', this.showDeal);
        this.registerEvent('select', this.showMissionAssignees);
        this.registerEvent('vote', this.showVotes);
        this.registerEvent('all_votes', this.showAllVotes);
        this.registerEvent('vote_success', this.showVoteSuccess);
        this.registerEvent('vote_fail', this.showVoteFail);
        this.registerEvent('vote_max_fails', this.showVoteMaxFails);
        this.registerEvent('vote_mission', this.showVotesMission);
        this.registerEvent('all_votes_mission', this.showAllVotesMission);
        this.registerEvent('error', this.showError);
        this.registerEvent('rematch', this.showRematch);
        this.registerEvent('next_mission', this.showNextMission);
        this.registerEvent('finish', this.showFinish);
    }

    registerEvent(name, handler) {
        this.state.eventHandlers[name] = handler;
    }

    setGame(game) {
        this.game = game;
    }

    event(event, params) {
        this.state.eventHandlers[event] && this.state.eventHandlers[event].apply(this, params);
    }

    showDeal() {
        this.game.round.roles.forEach((role, idx) => {
            let playerId = this.game.players[idx];
            console.log("Player", playerId, "has role", role);
        });
    }

    showMissionAssignees() {
        console.log("Mission assignees", this.game.round.assignees)
    }

    showVotes() {
        //console.log("Current votes", this.game.round.votes)
    }

    showVotesMission() {
        console.log("Current votes mission", this.game.round.mission)
    }

    showVoteSuccess() {
        console.log("Team selected");
    }

    showVoteFail() {
        console.log("Team not selected. Starting a new round.");
    }

    showVoteMaxFails() {
        console.log("Team not selected. Mission failed. Starting a new round.");
    }

    showAllVotes() {
        console.log(
            "All votes", this.game.round.votes,
            //"Failed attempts", this.game.round.failedAttempts,
            "Leader", this.game.round.leader)
    }

    showAllVotesMission() {
        console.log(
            "All votes mission", this.game.round.mission)
    }

    showVoteMissionSuccess() {
        console.log("Mission Success");
    }

    showVoteMissionFail() {
        console.log("Mission fail");
    }

    showNextMission() {
        console.log("New Mission", this.game);
    }

    showFinish(winners, players) {
        console.log("Game Finish", winners, players);
    }

    showRematch() {
        console.log("Rematch");
    }

    showError(code, details) {
        if (code === ERROR_NOT_CORRECT_ASSIGNEES) {
            console.log("Number of assignees is wrong.");
        } else if (code === ERROR_INVALID_PLAYER) {
            console.log("Some Player Id is invalid.", details);
        } else if (code === INVALID_OPERATION) {
            console.log("Invalid operation.", details);
        } else if (code === ERROR_PLAYER_ALREADY_VOTED) {
            console.log("Player already voted.", details);
        } else {
            console.log("Received Error", code, "details", details);
        }
    }

    showCurrentRound() {
        console.log("Number of participants in this round", this.game.requiredAssignees);
        console.log("Number of failed attempts to create team", this.game.failedAttempts)
    }

    tryDeal() {
        this.game.tryDeal();
    }

    trySelectAssignees(assignees) {
        this.game.trySelectAssignees(assignees);
    }

    tryVote(playerId, vote) {
        this.game.tryVote(playerId, vote);
    }

    tryEvalVotes() {
        this.game.tryEvalVotes();
    }

    tryVoteMission(playerId, vote) {
        this.game.tryVoteMission(playerId, vote);
    }

    tryEvalVotesMission() {
        this.game.tryEvalVotesMission();
    }

    tryRematch() {
        this.game.tryRematch();
    }


}

