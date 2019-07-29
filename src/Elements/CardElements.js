import Box from "@material-ui/core/Box";
import images from "../res/images";
import Typography from "@material-ui/core/Typography";
import React from "react";

let CardElement = (player, selected = false, keyPrefix = '') => (
    <Box key={keyPrefix + player} width={100} m={1}>
        <img width={100} src={images.vote_back} alt='vote'></img>
        <Typography component="h5" variant="h5" align="center" color={selected ? "textPrimary" : "textSecondary"}
                    gutterBottom>
            {player}
        </Typography>
    </Box>);

export {CardElement};
