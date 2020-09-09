import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import 'fontsource-roboto';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography'

import { IconButton } from '@material-ui/core';

  const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Trading(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={0} >
        <Grid item xs={4}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box fontWeight="fontWeightBold" textAlign="left">    
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="left">    
                <form className={classes.root} noValidate autoComplete="off">
                    <Typography variant="body2" color="textPrimary" align="left" >
                        From
                    </Typography>
                    <InputBase
                        className={classes.margin}
                        name="fromAmount"
                        value={props.fromAmount}
                        type="number" 
                        onChange={props.handleChange}
                        inputProps={{ style: { fontSize: 24 } }}
                   />
                    <br/><br/><br/>
                    <Typography variant="body2" color="textPrimary" align="left" >
                        To
                    </Typography>
                    <InputBase
                        className={classes.margin}
                        name="toAmount"
                        value={props.toAmount}
                        type="number" 
                        onChange={props.handleChange}
                        inputProps={{ style: { fontSize: 24 } }}
                   />
                   <br/><br/>
                </form>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="right">    
              <form className={classes.root} noValidate autoComplete="off">
                <Typography variant="body2" color="textPrimary" align="right" padding="20px">
                    Balance: {props.fromBalance}
                </Typography>
                <Select
                    disableUnderline
                    name="fromToken"
                    value={props.fromToken}
                    onChange={props.handleChange}
                    style={{
                      fontSize: 24
                    }}
                >
                  <MenuItem value="">
                  </MenuItem>
                  <MenuItem value={props.yesContractAddress}>YES TRUMP</MenuItem>
                  <MenuItem value={props.noContractAddress}>NO TRUMP</MenuItem>
                  <MenuItem value={props.daiContractAddress}>DAI</MenuItem>
              </Select>
              <br/><br/><br/>
              <Typography variant="body2" color="textPrimary" align="right" padding="20px">
                Balance: {props.toBalance}
                </Typography>
              <Select
                disableUnderline
                name="toToken"
                value={props.toToken}
                onChange={props.handleChange}
                style={{
                  fontSize: 24
                }}
              >
                <MenuItem value="">
                </MenuItem>
                <MenuItem value={props.yesContractAddress}>YES TRUMP</MenuItem>
                <MenuItem value={props.noContractAddress}>NO TRUMP</MenuItem>
                <MenuItem value={props.daiContractAddress}>DAI</MenuItem>
            </Select>
              <br/>
              <Typography variant="body2" color="textPrimary" align="right" padding="20px">
              Price per share: ${props.pricePerShare}
              </Typography>
              <Typography variant="body2" color="textPrimary" align="right" padding="20px">
              Max profit: ${props.maxProfit}
              </Typography>
              <Typography variant="body2" color="textPrimary" align="right" padding="20px">
              Price impact: {props.priceImpact}%
              </Typography>
              </form>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="left">    
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
