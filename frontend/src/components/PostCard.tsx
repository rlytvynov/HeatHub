import { ipost } from 'post'
import React from 'react'

export default function PostCard(props: ipost) {
  return (
    <fieldset className='post-card'>
        <div className='image-container'>
            <img src={props.image} alt="image" />
        </div>
        <div className="description">
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="header">
                <h4 style={{margin: 0}}>{props.name}</h4>
                <div>{props.publishDate.toLocaleDateString()}</div>
            </div>
            <fieldset style={{padding: '0.5rem'}}>{props.category.toUpperCase()}</fieldset>
            <div className='card-text'>{props.text}</div>
            <button>More</button>
        </div>
    </fieldset>
  )
}