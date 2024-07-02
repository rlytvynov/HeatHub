import { item } from 'item'
import React from 'react'
import { itemCart } from '../data/cartStore';

type Props = {
    item: itemCart,
    onIncrement: () => void;
    onDecrement: () => void;
}

export default function ItemShortCard({item, onIncrement, onDecrement}: Props) {
    return (
        <fieldset className="item-to-cart" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '3rem', alignItems: 'start', height: '100%'}}>
                <div className="image-container">
                    <img style = {{
                            width: '100%',
                            minHeight: '5rem',
                            maxHeight: '5rem',
                            objectFit: 'contain'
                    }} src={item.image} alt="image" />
                </div>
                <div className="content-container">
                    <h4 style={{margin: 0, marginBottom: '5px', fontSize: '1rem'}}>{item.name}</h4>
                    <p style={{margin: 0, marginBottom: '5px'}}>{item.model}</p>
                    <p style={{margin: 0, marginBottom: '5px'}}>{item.price}₽</p>
                </div>
            </div>
            <div className="buttons-counter" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                <button onClick={onIncrement} style={{padding: 0, minWidth: '2rem', width: '2rem'}}>+</button>
                    <div>{item.amount}</div>
                <button onClick={onDecrement}style={{padding: 0, minWidth: '2rem', width: '2rem'}}>-</button>
            </div>
        </fieldset>
    )
}