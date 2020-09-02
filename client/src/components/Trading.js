import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import 'fontsource-roboto';
import TextField from '@material-ui/core/TextField'
import InputBase from '@material-ui/core/InputBase';

import StyledButton from './StyledButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';

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
                    <InputBase
                        className={classes.margin}
                        defaultValue="0"
                        inputProps={{ 'aria-label': 'naked' }}
                    />
                    <br/><br/>
                    <InputBase
                        className={classes.margin}
                        defaultValue="0"
                        inputProps={{ 'aria-label': 'naked' }}
                    />
                </form>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box fontWeight="fontWeightBold" textAlign="left">    
                <form className={classes.root} noValidate autoComplete="off">
                <InputBase
                        className={classes.margin}
                        defaultValue="0"
                        inputProps={{ 'aria-label': 'naked' }}
                    />
                    <br/><br/>
                    <InputBase
                        className={classes.margin}
                        defaultValue="0"
                        inputProps={{ 'aria-label': 'naked' }}
                    />
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
