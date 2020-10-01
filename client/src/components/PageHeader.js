import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import 'fontsource-roboto';

  const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: '-15px'
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

export default function PageHeader(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <Grid container spacing={0} >
        <Grid item xs={3}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="left"> 
              <div>
                <img src={'https://cdn.discordapp.com/attachments/744571125484224643/752307707708440606/catnip1.png'} alt="catnip" width="100"/>
              </div>   
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box  textAlign="left">              
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
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
