import React from 'react'
import PropTypes from 'prop-types'
import './ListItem.scss'

const ListItem = ({ title, children }) => {
    return <div className='main-list-item'>
        <div className='name'>{title}:</div>
        <div className='content'>{children}</div>
    </div>
}


export default ListItem