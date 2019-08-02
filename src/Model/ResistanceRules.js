import assert from 'assert';
import shuffle from 'knuth-shuffle-seeded';
import {
    ERROR_NOT_CORRECT_ASSIGNEES,
    ERROR_PLAYER_ALREADY_VOTED,
    ERROR_INVALID_PLAYER,
    INVALID_OPERATION
} from './ErrorCodes';

export default class ResistanceRules {
    constructor(players) {
        assert(players.length >= 5);
        this.numPlayers = players.length;
        this.players = players;
        this.axisPerPlayers = ResistanceRules.axisPerPlayers[this.numPlayers - 5];
        this.playersPerRound = ResistanceRules.playersPerRound[this.numPlayers - 5];
        this.numRounds = ResistanceRules.playersPerRound[0].length;
        this.className = 'ResistanceRules';
    }

    setLeader(numPlayers, lastLeader) {
        if (!lastLeader) {
            return Math.floor(Math.random() * numPlayers);
        }
        return (lastLeader + 1) % numPlayers;
    }

    setRoles() {
        let players = Array(this.numPlayers)
            .fill(ResistanceRules.RESISTANCE)
            .fill(ResistanceRules.AXIS, 0, this.axisPerPlayers);
        return shuffle(players);
    }

    requiredAssignees(numRound) {
        return this.playersPerRound[numRound];
    }

    validateAssignees(assignees, numRound) {
        let distinct = new Set(assignees);
        let requiredAssignees = distinct.size === this.playersPerRound[numRound];
        let allValid = assignees.every((p) => this.players.includes(p));
        if (!requiredAssignees) {
            return {success: false, code: ERROR_NOT_CORRECT_ASSIGNEES};
        }
        if (!allValid) {
            return {success: false, code: ERROR_INVALID_PLAYER};
        }
        return {success: true};
    }

    validateVote(playerId, vote, votes) {
        let isPlayer = this.isPlayer(playerId);
        let voted = votes[playerId];
        let booleanVote = vote === true || vote === false;
        if (!isPlayer) {
            return {success: false, code: ERROR_INVALID_PLAYER, details: playerId};
        } else if (voted) {
            return {success: false, code: ERROR_PLAYER_ALREADY_VOTED, details: playerId};
        } else if (!booleanVote) {
            return {success: false, code: INVALID_OPERATION};
        } else {
            return {success: true}
        }
    }

    validateVoteMission(playerId, assignees, numRound, vote, votes) {
        let isPlayer = this.isPlayer(playerId);
        let isAssignee = assignees.includes(playerId);
        let voted = votes[playerId];
        let booleanVote = vote === true || vote === false;
        if (!isPlayer || !isAssignee) {
            return {success: false, code: ERROR_INVALID_PLAYER, details: playerId};
        } else if (voted) {
            return {success: false, code: ERROR_PLAYER_ALREADY_VOTED, details: playerId};
        } else if (!booleanVote) {
            return {success: false, code: INVALID_OPERATION};
        }
        else {
            return {success: true}
        }
    }

    evalVotes(votes, failedAttempts) {
        if(votes.length < this.players.length){
            return -2;
        }
        let count = votes.reduce((vote, sum) => sum + vote);
        if (count < Math.round(votes.length / 2)) {
            return failedAttempts === ResistanceRules.maxFailedAttemps ? -1 : 0
        }
        return 1;
    }

    evalVotesMission(votes, failedAttempts, numRound) {
        if(votes.length < this.playersPerRound[numRound]){
            return -1;
        }
        return votes.some((vote) => !vote) ? 0 : 1;
    }

    isVotesReady(votes) {
        return Object.keys(votes).length === this.players.length;
    }

    isVotesMissionReady(votes, numRound) {
        return Object.keys(votes).length === this.playersPerRound[numRound];
    }

    isPlayer(playerId) {
        return this.players.includes(playerId);
    }

    isWinner(role, missionSuccess) {
        return (role === ResistanceRules.RESISTANCE && missionSuccess) ||
            (role === ResistanceRules.AXIS && !missionSuccess);
    }

    getResult(rounds){
        return rounds.reduce(
            ({successes, fails}, r) => {
                return r.success ?
                    {successes: successes + 1, fails} : {successes, fails: fails + 1}
            }, {successes : 0, fails : 0});
    }

    getWinners(rounds, players){
        let {successes, fails} = this.getResult(rounds);
        if(successes === 3){
            return ResistanceRules.RESISTANCE;
        }else if(fails === 3){
            return ResistanceRules.AXIS;
        }
        return 0;
    }

    isNextMission(rounds) {
        let {successes, fails} = this.getResult(rounds);
        return !(successes === 3 || fails === 3);
    }

}

// Minimum 5 players.
ResistanceRules.axisPerPlayers = [2, 2, 3, 3, 3, 4];
ResistanceRules.playersPerRound = [
    [2, 3, 2, 3, 3], //with 5 players
    [2, 3, 4, 3, 4],
    [2, 3, 3, 4, 4],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
];

ResistanceRules.maxFailedAttemps = 2;

ResistanceRules.RESISTANCE = 100;
ResistanceRules.AXIS = 200;
