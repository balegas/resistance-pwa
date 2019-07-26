import React, {Component} from "react";
import images from "res/images";
import {withStyles} from '@material-ui/styles';

const style = {

    board: {
        position: 'relative',
    },

    responsiveImg: {},

    marker: {
        position: 'absolute',
        width: 136,
    },

    marker0: {
        top: 405,
        left: 93
    },

    marker1: {
        top: 75,
        left: 204
    },

    marker2: {
        top: 190,
        left: 689
    },

    marker3: {
        top: 607,
        left: 499
    },

    marker4: {
        top: 292,
        left: 1117
    },

};

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
            <div className={classes.board}>
                <img alt="Game Board" src={images.game_board}></img>
                {markers.reduce(printMarkers, [])
                }
            </div>
        );
    }

};

export default withStyles(style)(Board);

