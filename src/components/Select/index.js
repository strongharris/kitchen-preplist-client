import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { styles } from './selectStyles';

export const BoxedSelect = ({ label, items, name, onChange, selected }) => {
  const classes = styles();
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor={`select-${name}`} className={classes.menuItem}>{label}</InputLabel>
      <Select value={selected} onChange={onChange} labelWidth={labelWidth} className={classes.select} input={<OutlinedInput className={classes.menuItem} name={name} id={`select-${name}`} />}>
        {items.map(({ _id, label, name }) => {
          return (
            <MenuItem key={_id} value={_id} className={classes.menuItem}>{label}</MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export const DefaultSelect = ({ label, items, name, onChange, selected }) => {
  const classes = styles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={`select-${name}`}>{label}</InputLabel>
      <Select selected={selected} onChange={onChange}>
        {items.map(({ label, selected }) => {
          return (
            <MenuItem key={selected} selected={selected}>{label}</MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

BoxedSelect.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, selected: PropTypes.selected })),
  name: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.string,
}

DefaultSelect.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, selected: PropTypes.selected })),
  name: PropTypes.string,
  onChange: PropTypes.func,
  selected: PropTypes.string,
}

