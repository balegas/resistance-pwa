import ConsoleUI from "./ConsoleUI";
import ResistanceRules from "./ResistanceRules";
import Game from "./Game";

let players = [
    'player1',
    'player2',
    'player3',
    'player4',
    'player5'
];

let rules = new ResistanceRules(players);

let consoleUI = new ConsoleUI();

let game = new Game(players, rules, consoleUI);

consoleUI.setGame(game);

consoleUI.tryDeal();

consoleUI.trySelectAssignees(['player1', 'player2']);

consoleUI.tryVote('player1', false);
consoleUI.tryVote('player2', false);
consoleUI.tryVote('player3', false);
consoleUI.tryVote('player4', true);
consoleUI.tryVote('player5', true);

consoleUI.tryEvalVotes();

consoleUI.trySelectAssignees(['player1', 'player2']);

consoleUI.tryVote('player1', false);
consoleUI.tryVote('player2', false);
consoleUI.tryVote('player3', false);
consoleUI.tryVote('player4', true);
consoleUI.tryVote('player5', true);
consoleUI.tryVote('player5', true);

consoleUI.tryEvalVotes();


consoleUI.trySelectAssignees(['player1', 'player2']);

consoleUI.tryVote('player1', false);
consoleUI.tryVote('player2', false);
consoleUI.tryVote('player3', true);
consoleUI.tryVote('player4', true);
consoleUI.tryVote('player5', true);

consoleUI.tryEvalVotes();

consoleUI.tryVoteMission('player1', true);
consoleUI.tryVoteMission('player2', true);
consoleUI.tryVoteMission('player3', true);
consoleUI.tryVoteMission('player4', true);
consoleUI.tryVoteMission('player5', true);

consoleUI.tryEvalVotesMission();


consoleUI.trySelectAssignees(['player1', 'player2', 'player3']);

consoleUI.tryVote('player1', false);
consoleUI.tryVote('player2', false);
consoleUI.tryVote('player3', true);
consoleUI.tryVote('player4', true);
consoleUI.tryVote('player5', true);

consoleUI.tryEvalVotes();

consoleUI.tryVoteMission('player1', true);
consoleUI.tryVoteMission('player2', true);
consoleUI.tryVoteMission('player3', true);
consoleUI.tryVoteMission('player4', true);
consoleUI.tryVoteMission('player5', true);

consoleUI.tryEvalVotesMission();

consoleUI.trySelectAssignees(['player1', 'player2']);

consoleUI.tryVote('player1', false);
consoleUI.tryVote('player2', false);
consoleUI.tryVote('player3', true);
consoleUI.tryVote('player4', true);
consoleUI.tryVote('player5', true);

consoleUI.tryEvalVotes();

consoleUI.tryVoteMission('player1', true);
consoleUI.tryVoteMission('player2', true);
consoleUI.tryVoteMission('player3', true);
consoleUI.tryVoteMission('player4', true);
consoleUI.tryVoteMission('player5', true);

consoleUI.tryEvalVotesMission();

consoleUI.tryRematch();

consoleUI.tryDeal();
