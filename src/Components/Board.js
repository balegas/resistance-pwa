import React, {Component} from "react";
import images from "res/images";
import {withStyles} from '@material-ui/styles';
import Container from '@material-ui/core/Container';

const style = {

        board: {
            position: 'relative',
        },

        responsiveImg: {
            width: '100%'
        },

        marker: {
            position: 'absolute',
            width: '10%',
        },

        marker0: {
            top: '44%',
            left: '9.5%'
        },

        marker1: {
            top: '7.5%',
            left: '17%',
        },

        marker2: {
            top: '20%',
            left: '50.5%'
        },

        marker3: {
            top: '65.5%',
            left: '37.5%'
        },

        marker4: {
            top: 292,
            left:
                1117
        }
        ,

    }
;

class Board extends Component {
    render() {
        const {classes} = this.props;
        const markers = this.props.missions.map(m => m.success ? 'allies' : 'axis');
        markers.push('current');
        const printMarkers = (acc, val, idx) => {
            acc.push((
                <img
                    className={`${classes.marker} ${classes["marker" + idx]}`}
                    key={"marker" + idx}
                    alt={"marker" + idx}
                    src={images[val]}>
                </img>));
            return acc;
        };

        return (
            <Container fixed className={classes.board} maxWidth="md">
                <img alt="Game Board" src={images.game_board} style={style.responsiveImg}></img>
                {markers.reduce(printMarkers, [])}
            </Container>
        );
    }

};

export default withStyles(style)(Board);

