import Game from '../../Model/Game.js'
import ResistanceRules from "../../Model/ResistanceRules";

let game;
let players;
let rules;
let events;

const storeEvent = (eventName, args) => {
    events.push({event: eventName, type: 'global', params: args});
};


const eventHandlers = {
    'deal': (...args) => storeEvent('deal', args),
    'select': (...args) => storeEvent('select', ...args),
    'vote': (...args) => storeEvent('vote', args),
    'all_votes': (...args) => storeEvent('all_votes', args),
    'vote_fail': (...args) => storeEvent('vote_fail', args),
    'vote_max_fail': (...args) => storeEvent('vote_max_fail', args),
    'vote_success': (...args) => storeEvent('vote_success', args),
    'vote_mission': (...args) => storeEvent('vote_mission', args),
    'all_votes_mission': (...args) => storeEvent('all_votes_mission', args),
    'next_mission': (...args) => storeEvent('next_mission', args),
    'finish': (...args) => storeEvent('finish', args),
    'rematch': (...args) => storeEvent('rematch', args),
    'error': (...args) => /*storeEvent('error', args)*/ undefined,
};


beforeAll(() => {
    events = [];
    players = ['player1', 'player2', 'player3', 'player4', 'player5'];
    rules = new ResistanceRules(players);
    game = new Game(players, rules, eventHandlers)
});


describe('Basic init tests', () => {
    let leader;

    test('Leader is set', () => {
        expect(players.includes(game.leader)).toEqual(true);
        leader = game.leader;
    });

    test('No other player can deal', () => {
        players.filter((p) => p != leader).forEach(p => game.tryDeal(p));
        expect(events.length).toEqual(0);
    });

    test('Leader can deal', () => {
        game.tryDeal(leader);
        expect(events[0].event).toEqual('deal');
    });
});
