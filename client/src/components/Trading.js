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
import StyledButton from './StyledButton';

const tokens = [
    {
      value: 'YES',
      label: 'YES',
    },
    {
      value: 'NO',
      label: 'NO',
    },
    {
      value: 'DAI',
      label: 'DAI',
    },
  ];
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
            <Box fontWeight="fontWeightBold" textAlign="left">    
                <form className={classes.root} noValidate autoComplete="off">
                <Typography variant="body2" color="black" align="left" padding="20px">
                        From
                    </Typography>
                    <InputBase
                        className={classes.margin}
                        name="fromAmount"
                        value={props.fromAmount}
                        onChange={props.handleChange}
                        defaultValue="0"
                        inputProps={{ 'aria-label': 'naked' }}
                    />
                    <br/><br/>

                </form>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box fontWeight="fontWeightBold" textAlign="left">    
                <form className={classes.root} noValidate autoComplete="off">
                    <Typography variant="body2" color="black" align="left" padding="20px">
                        Balance
                    </Typography>
                <Select
                    disableUnderline
                    defaultValue="DAI"
                    name="fromToken"
                    value={props.fromToken}
                    onChange={props.handleChange}
                    inputProps={{
                        name: "fromToken",
                        id: "fromToken"
                    }}
                >
                    <MenuItem value="">
                    </MenuItem>
                    <MenuItem value={props.yesContractAddress}>YES TRUMP</MenuItem>
                    <MenuItem value={props.noContractAddress}>NO TRUMP</MenuItem>
                    <MenuItem value={props.daiContractAddress}>DAI</MenuItem>
                </Select>
               </form>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box fontWeight="fontWeightBold" textAlign="left">    
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
