import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    padding: '0.75rem 0.5rem',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  radioGroup: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',    
  },
  parDaily: {
    marginTop: '1.65rem',
    marginLeft: theme.spacing(1),
  },
  parDay: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  list: {
    height: 150,
    overflowY: 'scroll',
  },
  listItemSelected: {
    backgroundColor: theme.palette.grey.light,
    height: 35,
  },
  listItem: {
    height: 35,
  },
  listItemText: {
    fontSize: 12,
  },
  inputLabel: {
    marginBottom: 0,
  },
  formControl: {

    minWidth: 120,
    maxWidth: 300,
  },    
}));
