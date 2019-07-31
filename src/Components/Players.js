import React, {Component} from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default class Players extends Component {

    playerItem = (player, leader) => (
        <ListItem key={'player_' + player.id}>
            <ListItemText
                primary={player.id + (leader ? ' (Leader)' : '')}
                secondary={"Victories: " + player.wins}/>
        </ListItem>);

    render() {
        const {players, leader} = this.props;
        return (
            <List>
                {players.map(p => this.playerItem(p, p.id === leader))}
            </List>);
    }
}
