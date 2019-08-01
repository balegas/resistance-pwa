import React, {Component} from "react";
import images from "res/images";
import {withStyles} from '@material-ui/styles';
import Box from '@material-ui/core/Box';

const style = {

        board: {
            position: 'relative',
        },

        responsiveImg: {
            width: '100%'
        },

        marker: {
            position: 'absolute',
            width: '13%',
        },

        marker0: {
            top: '41%',
            left: '5%'
        },

        marker1: {
            top: '6%',
            left: '13%',
        },

        marker2: {
            top: '19%',
            left: '49%'
        },

        marker3: {
            top: '65%',
            left: '35%'
        },

        marker4: {
            top: '30%',
            left: '81%'
        }
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
            <Box className={classes.board} maxWidth="100%" minWidth={600}>
                <img alt="Game Board" src={images.game_board} style={style.responsiveImg}></img>
                {markers.reduce(printMarkers, [])}
            </Box>
        );
    }

}

export default withStyles(style)(Board);

