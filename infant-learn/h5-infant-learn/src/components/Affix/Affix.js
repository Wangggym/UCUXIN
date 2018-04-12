import React from 'react'

const Affix = ({ img, AttachUrl, AttachName, Size }) => {
    return <a className='expertAffix' href={AttachUrl}>
        <img src={img} />
        <div className='content'>
            <span className='name'>{AttachName}</span>
            <span className='size'>120KB</span>
        </div>
    </a>
}

export default Affix