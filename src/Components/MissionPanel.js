import React, {Component} from "react";
import {withStyles} from '@material-ui/styles';
import Box from "@material-ui/core/Box";

const style = {};

class MissionPanel extends Component {
    render() {
        return (
            <container>
                <div>{this.props.currentState}</div>
                <Box display="flex" flexDirection="row" p={1} bgcolor="background.paper">
                    <Box p={1} m={1} bgcolor="grey.300">
                        Item 1
                    </Box>
                    <Box p={1} m={1} bgcolor="grey.300">
                        Item 1
                    </Box>
                    <Box p={1} m={1} bgcolor="grey.300">
                        Item 1
                    </Box>
                </Box>
            </container>
        )

    };
}

export default withStyles(style)(MissionPanel);

