import React, {Component} from "react";
import {withStyles} from '@material-ui/styles';
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {CardElement} from '../Elements/CardElements'

const style = {};

class MissionPanel extends Component {

    stages = {
        'voting': () => this.renderCards(Object.keys(this.props.game.round.votes), this.props.game.round.assignees),
        'mission': () => this.renderCards(Object.keys(this.props.game.round.mission), this.props.game.round.assignees),
    };

    renderCards = (cardsArray, assigneesArray) => {
        let assigneesCards = [];
        let cards = [];
        for (let i = 0; i < assigneesArray.length; i++) {
            assigneesCards.push(CardElement(assigneesArray[i], false, 'assignee'))
        }
        for (let i = 0; i < cardsArray.length; i++) {
            cards.push(CardElement(cardsArray[i]))
        }
        return (
            <Box>
                {assigneesArray &&
                <Box style={{minHeight: 300}}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary">Assignees</Typography>
                    <Box display="flex" flexWrap="wrap" flexDirection="row">
                        {assigneesCards}
                    </Box>
                </Box>
                }
                <Box style={{minHeight: 300}}>
                    <Typography component="h1" variant="h2" align="center" color="textPrimary">Votes</Typography>
                    <Box display="flex" flexWrap="wrap" flexDirection="row">
                        {cards}
                    </Box>
                </Box>
            </Box>
        );
    };

    renderStage = () => {
        let func = this.stages[this.props.game.currentState];
        return func && func.apply(this);
    };

    render() {
        return (
            <Container>
                <Box display="flex" flexWrap="wrap" flexDirection="row" p={1}>
                    {this.renderStage()}
                </Box>
            </Container>
        )

    }
    ;
}

export default withStyles(style)(MissionPanel);

