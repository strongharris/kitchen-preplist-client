import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: '70%',
    },
    paddingTop: '25%'
  }, 
}));