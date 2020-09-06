import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography'

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

export default function PageHeader(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <Grid container spacing={0} >
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="left">   
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box  textAlign="center">
              <div>
                <img src={'https://i.etsystatic.com/10378440/d/il/0ce234/2261824722/il_75x75.2261824722_q5a3.jpg?version=0'} alt="catnip" />
              </div> 
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper} square={true} elevation={0}>
            <Box textAlign="left"> 
                <br/><br/>  
                <Typography variant="h5" color="textPrimary" align="left" fontWeight="fontWeightBold" >
                  simple, liquid, real-world markets
                </Typography>
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
