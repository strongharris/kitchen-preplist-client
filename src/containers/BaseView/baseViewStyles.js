import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles( theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
  },
  formControl: {
    minWidth: '14rem',
  },
  appBar: {
    padding: theme.spacing(1),
    backgroundColor: 'white',
  },
  datePicker: {
    margin: theme.spacing(1),
    fontSize: '0.6rem'
  },
  tabs: {
    marginBottom: '-8px',
    margin: '-10px -22px 0px -22px',
  },
  tab: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.75rem',
    },
  }
}));
