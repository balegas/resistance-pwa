const ERROR_PLAYER_ALREADY_VOTED = 0xF00002;
const ERROR_INVALID_PLAYER = 0xF00001;
const ERROR_NOT_CORRECT_ASSIGNEES = 0xF00000;
const INVALID_OPERATION = 0xE00000;

export {
    ERROR_PLAYER_ALREADY_VOTED,
    ERROR_INVALID_PLAYER,
    ERROR_NOT_CORRECT_ASSIGNEES,
    INVALID_OPERATION
}

export function msg_for_error(codeOrError) {
    // if(isNaN(codeOrError )){
    // }
    switch (codeOrError) {
        case ERROR_NOT_CORRECT_ASSIGNEES:
            return "Number of assignees is wrong.";
        case ERROR_INVALID_PLAYER:
            return `Some Player Id is invalid. ${arguments[1]}`;
        case INVALID_OPERATION:
            return `Invalid operation. ${arguments[1]}`;
        case ERROR_PLAYER_ALREADY_VOTED:
            return `Player already voted. ${arguments[1]}`;
        default:
            return `Error: ${codeOrError}`
    }
}
