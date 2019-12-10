import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 80,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
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
  }
}));
