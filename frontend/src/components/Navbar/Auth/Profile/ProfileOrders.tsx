import React from 'react'

type Props = {}

export default function ProfileOrders({}: Props) {
    return (
        <article className="profile orders" role="tabpanel" id="tab-notifications">
            <fieldset>
                <legend>Orders</legend>
                <ul className="tree-view">
                    <li>We can put</li>
                    <li>We want in here</li>
                </ul>
            </fieldset>
        </article>
    )
}