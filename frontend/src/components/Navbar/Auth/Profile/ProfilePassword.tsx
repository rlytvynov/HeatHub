import React from 'react'

type Props = {}

export default function ProfilePassword({}: Props) {
    return (
        <article className="profile password" role="tabpanel" id="tab-password">
            <fieldset>
                <legend>Password Change</legend>
                <div className="field-row-stacked" style={{width: "100%"}}>
                    <label htmlFor="old-password">Old Password</label>
                    <input id="old-password" type="password" />
                </div>
                <div className="field-row-stacked" style={{width: "100%"}}>
                    <label htmlFor="new-password">New Password</label>
                    <input id="new-password" type="password" />
                </div>
                <div className="field-row-stacked" style={{width: "100%"}}>
                    <label htmlFor="new-password-confirm">New Password Confirm</label>
                    <input id="new-password-confirm" type="password" />
                </div>
            </fieldset>
        </article>
    )
}