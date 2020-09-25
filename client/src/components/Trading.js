import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import 'fontsource-roboto';
import Container from '@material-ui/core/Container';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import Typography from '@material-ui/core/Typography'
import StyledButton from './StyledButton';
import TImg from '../assets/images/t.png';
import NTImg from '../assets/images/nt.png';
import DImg from '../assets/images/d.png';
import { KeyboardArrowDown } from '@material-ui/icons';

  const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,

    '& .MuiTypography-h6': {
      color: '#6f6f6f',
      marginBottom: '15px'
    },

    '& .MuiSelect-root': {
      display: 'flex',
      alignItems: 'center',
      paddingRight: '0',

      '&:focus': {
        backgroundColor: 'transparent'
      },

      '& img': {
        width: '25px',
        borderRadius: '25px',
        marginRight: '10px'
      }
    }
  },
  main_part: {
    padding: '30px 16px 20px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: '30px',
    boxShadow: 'rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px',
    borderRadius: '30px'
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  inputItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid rgb(247, 248, 250)',
    borderRadius: '20px'
  },
  displayFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5px'
  },
  no_price_impact: {
    color: '#202020',
    fontWeight: 'bold'
  },
  price_impact: {
    fontWeight: 'bold'
  },
  menu_item: {
    '& img': {
      width: '25px',
      marginRight: '15px',
      borderRadius: '20px'
    }
  }
}));

export default function Trading(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container>
        <Grid container spacing={0} >
          <Grid item xs={4}>
            <Paper square={true} elevation={0}>
              <Box fontWeight="fontWeightBold" textAlign="left">    
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.main_part} square={true} elevation={0}>
              <div>
                <Typography variant="h6" color="textPrimary"  align="left" fontWeight="fontWeightBold" >
                  Will Trump win the 2020 U.S. <br/> presidential election?
                </Typography>
              </div>
              <div className={classes.inputItem}>
                <div>
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
                </div>
                <div>
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
                    IconComponent={() => (
                      <KeyboardArrowDown />
                    )}
                  >
                      <MenuItem value=""></MenuItem>
                      <MenuItem value={props.yesContractAddress} className={classes.menu_item}><img src={TImg} alt=""/> <span>YES TRUMP</span></MenuItem>
                      <MenuItem value={props.noContractAddress} className={classes.menu_item}><img src={NTImg} alt=""/> <span>NO TRUMP</span></MenuItem>
                      <MenuItem value={props.daiContractAddress} className={classes.menu_item}><img src={DImg} alt=""/> <span>DAI</span></MenuItem>
                  </Select>
                </div>
              </div>
              <div className={classes.inputItem}>
                <div>
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
                </div>
                <div>
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
                      IconComponent={() => (
                        <KeyboardArrowDown />
                      )}
                    >
                      <MenuItem value="">
                      </MenuItem>
                      <MenuItem value={props.yesContractAddress} className={classes.menu_item}><img src={TImg} alt=""/> <span>YES TRUMP</span></MenuItem>
                      <MenuItem value={props.noContractAddress} className={classes.menu_item}><img src={NTImg} alt=""/> <span>NO TRUMP</span></MenuItem>
                      <MenuItem value={props.daiContractAddress} className={classes.menu_item}><img src={DImg} alt=""/> <span>DAI</span></MenuItem>
                  </Select>
                </div>
              </div>
              <StyledButton variant="contained" onClick={props.swapBranch}>Swap</StyledButton>
            </Paper>
            <Paper square={true} elevation={0}>
              <Box textAlign="right">    
                <form className={classes.root} noValidate autoComplete="off">
                  <div className={classes.displayFlex}>
                    <Typography variant="body2" color="textPrimary" padding="20px">
                      Price per share:
                    </Typography>
                    <Typography variant="body2" color="textPrimary" padding="20px" className={classes.no_price_impact}>
                      ${props.pricePerShare}
                    </Typography>                
                  </div>
                  <div className={classes.displayFlex}>
                    <Typography variant="body2" color="textPrimary" padding="20px">
                      Max profit:
                    </Typography>
                    <Typography variant="body2" color="textPrimary" padding="20px" className={classes.no_price_impact}>
                      ${props.maxProfit}
                    </Typography>
                  </div>
                  <div className={classes.displayFlex}>
                    <Typography variant="body2" color="textPrimary" padding="20px">
                      Price impact:
                    </Typography>
                    <Typography variant="body2" color="textPrimary" padding="20px" className={[props.priceImpactColor,'bold'].join(' ')}>
                      {props.priceImpact}%
                    </Typography>
                  </div>                
                </form>
              </Box>
            </Paper>
          </Grid>        
          <Grid item xs={4}>
            <Paper square={true} elevation={0}>
              <Box textAlign="left">    
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
