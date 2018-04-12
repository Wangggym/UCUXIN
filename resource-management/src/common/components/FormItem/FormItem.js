import React from 'react';
import './style.scss'

class FormItem extends React.Component {
  render() {
    const { label, children, valid, error } = this.props;
    return (
      <span>
        <label>{label}</label>
        {children}
        {!valid && <span className='error'>{error}</span>}
      </span>
    );
  }
}

export default FormItem;


