import { iuserExtend } from "user"
import { useAuthContext } from "../../../../contexts/AuthProvider"

type Props = {}
export default function ProfileNotifications({}: Props) {
    const authContext= useAuthContext()
    return (
        <article className="profile notifications" role="tabpanel" id="tab-notifications">
            <fieldset>
                <legend>Notifications</legend>
                <div className="field-row">
                    <input id="radio10" checked={(authContext.user as iuserExtend).notifications.notificationOrdersStatus} type="checkbox" name="fieldset-example2"/>
                    <label htmlFor="radio10">Уведомлять меня о статусе заказов</label>
                </div>
                <div className="field-row">
                    <input id="radio11" checked={(authContext.user as iuserExtend).notifications.notificationCommentsStatus} type="checkbox" name="fieldset-example2"/>
                    <label htmlFor="radio11">Уведомлять меня об ответах на комментарии</label>
                </div>
                <div className="field-row">
                    <input id="radio12" checked={(authContext.user as iuserExtend).notifications.notificationMessagesFromAdminStatus} type="checkbox" name="fieldset-example2"/>
                    <label htmlFor="radio12">Уведомлять меня о сообщениях от администратора</label>
                </div>
                <div className="field-row">
                    <input id="radio13" checked={(authContext.user as iuserExtend).notifications.notificationNewItemsStatus} type="checkbox" name="fieldset-example2"/>
                    <label htmlFor="radio13">Уведомлять меня о новых товарах</label>
                </div>
            </fieldset>
        </article>
    )
}