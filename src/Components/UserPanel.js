import {Component} from "react";

class UserPanel extends Component {
    state = {
        team: undefined,
        game: undefined,
    };

    constructor(props) {
        super(props);
        this.state = {
            game : props.game
        }
    }

    applyAction(player, action){

    }

    render(){

    }
}
