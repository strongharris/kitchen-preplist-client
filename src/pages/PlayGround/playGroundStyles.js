import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles(theme => ({
  root: {
    padding: '2rem 0.5rem',
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),  
  },
  stationContainer: {
    marginBottom: theme.spacing(4),
    padding: '0rem',
    position: 'relative',
  },
  itemListContainer: {
    paddingTop: '0.5rem',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  stationTitle: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    borderRadius: '0.4rem',
    padding: '0.4rem',
    fontSize: '0.7rem',
  },
  table: {
    minWidth: '240px',
  },
  smallFont: {
    fontSize: '0.6rem',
  },
  itemHeadContainer: {
    boxShadow: 'none',
    borderColor: 'white',
    borderLeft: `0.2rem solid ${theme.palette.primary.main}`,
    marginBottom: '1.2rem',
    marginTop: '1.2rem',
  },
  itemHead: {
    flexGrow: 1,
    marginLeft: '2px',
  },
  itemContainer: {
    marginBottom: '1.2rem',
    borderLeft: `0.2rem solid ${theme.palette.primary.main}`
  }
}));