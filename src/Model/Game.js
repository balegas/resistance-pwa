import {INVALID_OPERATION} from './ErrorCodes';
import ResistanceRules from "./ResistanceRules";
import EventEmitter from 'events';

//Add preconditions for state transitions
const transitions = {
    init: [
        {transition: 'deal', to: 'build_team'}],
    build_team: [
        {transition: 'select', to: 'voting'}],
    voting: [
        {transition: 'vote', to: 'voting'},
        {transition: 'all_votes', to: 'eval_votes'}],
    eval_votes: [
        {transition: 'vote_fail', to: 'build_team'},
        {transition: 'vote_max_fails', to: 'eval_mission'},
        {transition: 'vote_success', to: 'mission'}],
    mission: [
        {transition: 'vote_mission', to: 'mission'},
        {transition: 'all_votes_mission', to: 'eval_mission'}],
    eval_mission: [
        {transition: 'next_mission', to: 'build_team'},
        {transition: 'finish', to: 'finish'}],
    finish: [
        {transition: 'rematch', to: 'init'}]
};


export default class Game {

    constructor(players, rules, eventHandlers) {
        this.state = {
            game: this.newGame(players.reduce(this.createPlayer, []), rules),
            eventEmitter: new EventEmitter(),
            rules, eventHandlers, players
        };
        this.registerEventHandlers(this.state.eventEmitter, eventHandlers)
    }

    registerEventHandlers(emitter, handlers) {
        Object.keys(handlers).forEach((eventName) => {
            emitter.on(eventName, handlers[eventName])
        })
    }

    //Getters
    get round() {
        return this.state.game.round;
    }

    set round(round) {
        return this.state.game.round = round;
    }

    get game() {
        return this.state.game;
    }

    set game(game) {
        this.state.game = game;
    }

    get currentState() {
        return this.round.currentState;
    }

    set currentState(state) {
        this.round.currentState = state;
    }

    get roles() {
        return this.round.roles;
    }

    get votes() {
        return this.round.votes;
    }

    get mission() {
        return this.round.mission;
    }

    get missions() {
        return this.game.missions;
    }

    get currentMission() {
        return this.game.missions.length;
    }

    get countSuccess() {
        return this.game.missions.reduce((success, m) => m.success ? success + 1 : success, 0)
    }

    get failedAttempts() {
        return this.round.failedAttempts;
    }

    get rules() {
        return this.state.rules;
    }

    get players() {
        return this.game.players;
    }

    set players(players) {
        this.game.players = players;
    }

    get requiredAssignees() {
        return this.rules.requiredAssignees(this.currentMission);
    }

    get leader() {
        return this.getPlayerByIdx(this.round.leader);
    }

    getPlayerByIdx(playerIdx) {
        return this.players.map(p => p.id)[playerIdx];
    }

    getPlayerIdxById(playerId) {
        return this.players.findIndex(p => p.id === playerId);
    }

    getImageForPlayer(playerId) {
        let role = this.getRole(playerId).toLowerCase();
        let idx = this.getPlayerIdxById(playerId) % (role === 'axis' ? 4 : 6);
        return role + idx;
    }

    getRole(playerId) {
        const idx = this.players.map(p => p.id).indexOf(playerId);
        const role = this.round.roles[idx];
        return role === ResistanceRules.AXIS ? 'Axis' : 'Ally';
    }

    transition(t, mutation, eventParams) {
        let result = transitions[this.currentState].find(({transition}) => t === transition);
        if (result) {
            let {to} = result;
            mutation && mutation();
            this.currentState = to;
            this.triggerEvent(t, eventParams);
            return true;
        } else {
            this.triggerEvent('error', [INVALID_OPERATION, t]);
            return false;
        }
    }

    triggerEvent(event, params = []) {
        if (this.state.eventEmitter != null) {
            this.state.eventEmitter.emit.apply(this.state.eventEmitter, [event, ...params]);
        }
    }

    isLeader(playerId) {
        if (this.game.players.findIndex(p => p.id === playerId) !== this.round.leader) {
            return false;
        }
        return true;
    }

    isLeaderOrError(playerId) {
        if (!this.isLeader(playerId)) {
            this.triggerEvent('error', ['Only leader can call this action']);
            return false;
        }
        return true;
    }

    checkCurrentState(currentState) {
        if (!this.currentState === currentState) {
            this.triggerEvent('error', [INVALID_OPERATION, currentState]);
            return false;
        }
        return true;
    }

    //DEAL

    tryDeal(playerId) {
        console.log("[tryDeal]", playerId);
        if (!this.checkCurrentState('init')) return;
        if (!this.isLeaderOrError(playerId)) return;

        this.deal();
        console.log("[tryDeal]", "success");
    }

    deal() {
        this.transition('deal');
    }

    //Select Assignees

    trySelectAssignees(playerId, assignees) {
        console.log("[trySelectAssignees]", playerId, assignees);
        if (!this.checkCurrentState('build_team')) return;
        if (!this.isLeaderOrError(playerId)) return;

        let {success, code, details} = this.rules.validateAssignees(assignees, this.currentMission);
        if (!success) {
            this.triggerEvent('error', [code, details]);
            return;
        } else {
            this.select(assignees);
        }
        console.log("[trySelectAssignees]", "success");
    }

    select(assignees) {
        let mutation = () => this.round.assignees = assignees;
        this.transition('select', mutation, [assignees])
    }

    //Vote

    tryVote(playerId, vote) {
        console.log("[tryVote]", playerId, vote);
        if (!this.checkCurrentState('voting')) return;

        let {success, code, details} = this.rules.validateVote(playerId, vote, this.votes);
        if (!success) {
            this.triggerEvent('error', [code, details]);
            return;
        }
        this.vote(playerId, vote);
        if (this.rules.isVotesReady(this.votes)) {
            this.allVotes();
        }
        console.log("[tryVote]", "success");
    }

    vote(playerId, vote) {
        let mutation = () => this.round.votes[playerId] = vote;
        this.transition('vote', mutation, [playerId]);
    }

    allVotes() {
        console.log("[allVotes]");
        this.transition('all_votes');
    }

    //Eval Votes

    tryEvalVotes(playerId) {
        console.log("[tryEvalVotes]", playerId);
        if (!this.checkCurrentState('eval_votes')) return;
        if (!this.isLeaderOrError(playerId)) return;

        //1: success, 0: fail, -1: max fails
        let result = this.rules.evalVotes(Object.values(this.round.votes), this.round.failedAttempts);
        if (-1 > result > 1) {
            this.triggerEvent('error', ['error evaluating votes', result]);
            return;
        }
        switch (result) {
            case 1 :
                this.voteSuccess();
                break;
            case 0 :
                this.voteFail();
                break;
            case -1 :
                this.voteMaxFails();
                break;
            default:
                this.triggerEvent('error', [INVALID_OPERATION, 'eval_votes']);
        }
        console.log("[tryEvalVotes]", "success");
    }

    voteSuccess() {
        this.transition('vote_success');
    }

    voteFail() {
        this.transition('vote_fail', () => this.roundFailed())
    }

    voteMaxFails() {
        let mutation = () => {
            this.round.success = false;
            this.missions.push(this.round);
            this.round = this.nextRound();
        };
        this.transition('vote_max_fails', () => mutation);
    }

    //Vote mission

    tryVoteMission(playerId, vote) {
        console.log("[tryVoteMission]", playerId, vote);
        if (!this.checkCurrentState('mission')) return;

        let {success, code, details} = this.rules.validateVoteMission(playerId, this.round.assignees, this.currentMission, vote, this.mission,);
        if (!success) {
            this.triggerEvent('error', [code, details]);
            return;
        }
        this.voteMission(playerId, vote);
        if (this.rules.isVotesMissionReady(this.mission, this.currentMission)) {
            this.allVotesMission();
        }
        console.log("[tryVoteMission]", "success");
    }

    voteMission(playerId, vote) {
        let mutation = () => this.round.mission[playerId] = vote;
        this.transition('vote_mission', mutation, [playerId]);
    }

    allVotesMission() {
        this.transition('all_votes_mission');
    }

    //Eval Votes Mission

    tryEvalVotesMission(playerId) {
        console.log("[tryEvalVotesMission]", playerId);
        if (!this.checkCurrentState('eval_mission')) return;
        if (!this.isLeaderOrError(playerId)) return;

        let result = this.rules.evalVotesMission(Object.values(this.round.mission), this.currentMission);
        if (-1 > result > 1) {
            this.triggerEvent('error', ['error evaluating votes', result]);
            return;
        }

        this.updateMissionStatus(result === 1);
        console.log("[tryEvalVotesMission]", "success");
    }

    updateMissionStatus(success) {
        this.round.success = success;
        this.missions.push(this.round);
        if (this.rules.isNextMission(this.missions)) {
            this.transition("next_mission", () => this.nextMission(), [success, Object.values(this.round.mission)])
        } else {
            this.transition("finish", () => this.finish(), [this.rules.getWinners(this.missions, this.players), this.players]);
        }
    }

    nextMission() {
        this.round = this.nextRound();

    }

    finish() {
        this.roles.forEach((role, idx) => {
            if (this.rules.isWinner(role, this.round.success)) {
                this.players[idx].wins++;
            }
        });

    }

    //Rematch

    tryRematch(playerId) {
        console.log("[tryRematch]", playerId);
        if (!this.checkCurrentState('finish')) return;
        if (!this.isLeaderOrError(playerId)) return;

        let rematch = () => this.game = this.newGame(this.players, this.rules);
        this.transition('rematch', rematch);
    }

    //PRIVATE
    createPlayer(ac, pi) {
        ac.push({
            id: pi,
            wins: 0
        });
        return ac;
    }

    nextRound() {
        return {
            leader: this.rules.setLeader(this.players.length, this.round.leader),
            roles: this.roles,
            assignees: [],
            votes: {},
            mission: {},
            success: undefined,
            failedAttempts: 0,
        }
    }

    roundFailed() {
        this.round.failedAttempts++;
        this.round.votes = {};
        this.round.leader = this.rules.setLeader(this.players.length, this.round.leader);
    }

    newGame(players, rules) {
        return {
            players: players,
            totalMissions: 0,
            missions: [],
            round: {
                currentState: 'init',
                leader: rules.setLeader(players.length),
                roles: rules.setRoles(players.length),
                assignees: [],
                votes: {},
                mission: {},
                failedAttempts: 0,
                success: undefined
            }
        }
    }

    getState() {
        return {game: this.game, rules: this.rules.className, players: this.players};
    }

    static rulesClass = {
        'ResistanceRules': ResistanceRules
    };

    static fromState({game, rules, players}, eventHandlers) {
        let rulesObject = this.rulesClass[rules] && new this.rulesClass[rules](players.map(p => p.id));
        if (rulesObject) {
            let newGame = new Game(players, rulesObject, eventHandlers);
            newGame.players = players;
            newGame.game = game;
            return {success: true, value: newGame};
        }
        return {success: false, error: 'Invalid rules'};
    }

}
