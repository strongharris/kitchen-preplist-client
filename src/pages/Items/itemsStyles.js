import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles(theme => ({
  root: {
    padding: '6.5rem 0.5rem',
  },
  itemListContainer: {
    [theme.breakpoints.down('xs')] : {
      paddingLeft: '0.3rem',
      paddingRight: '0.3rem',
      paddingTop: '0.75rem',
    },
    paddingTop: '1.5rem',
    paddingLeft: '1.25rem',
    paddingRight: '1.25rem',
    paddingBottom: '1.5rem',
    marginBottom: '1rem',
  },
  itemListContainerDrag: {
    background: theme.palette.grey.light,
    paddingTop: '0.75rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '1.5rem',
    marginBottom: '1rem',
  },
  stationTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.75rem',
    },    
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    borderRadius: '0.4rem',
    padding: '0.4rem',
    fontSize: '1rem'
  },
  itemHeadContainer: {
    boxShadow: 'none',
    borderColor: 'white',
    borderLeft: `0.1rem solid ${theme.palette.primary.main}`,
    margin: '0.75rem 0',
  },
  itemHead: {
    flexGrow: 1,
    marginLeft: '0.25rem',
  },
  itemContainer: {
    marginBottom: '1.25rem',
    borderLeft: `0.1rem solid ${theme.palette.primary.main}`
  },
  addItemContainer: {
    marginBottom: '1rem',
    borderLeft: `0.1rem solid ${theme.palette.secondary.main}`
  },  
  itemContainerDrag: {
    userSelect: 'none',
    border: `0.2rem solid ${theme.palette.primary.main}`,
    paddingTop: '0.55rem',
    marginBottom: '1.25rem',
    borderLeft: `0.2rem solid ${theme.palette.primary.main}`,
    boxSizing: 'border-box',
    position: "fixed",
  },
  smallFont: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.75rem',
    },
  },
  button: {
    marginBottom: '0.75rem'
  },
  plusSign: {
    marginLeft: '0.4rem', 
    cursor: 'pointer'
  },
  minusSign: {
    marginLeft: '0.5rem', 
    cursor: 'pointer'    
  },
  checkbox: {
    padding: 0,
  },
  addItem: {
    marginRight: theme.spacing(1),
    color: theme.palette.grey.main,
  }    
}));