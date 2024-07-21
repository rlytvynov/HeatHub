import { iuserExtend, notification } from "user"
import { useAuthContext } from "../../../../contexts/AuthProvider"
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {}
interface FormNotificationData {
    checkbox: notification[]
}
export default function ProfileNotifications({}: Props) {
    const authContext= useAuthContext()
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<notification>({
        defaultValues: {
            notificationOrdersStatus: (authContext.user as iuserExtend).notifications.notificationOrdersStatus,
            notificationCommentsStatus: (authContext.user as iuserExtend).notifications.notificationCommentsStatus,
            notificationMessagesFromAdminStatus: (authContext.user as iuserExtend).notifications.notificationMessagesFromAdminStatus,
            notificationNewItemsStatus: (authContext.user as iuserExtend).notifications.notificationNewItemsStatus
        }
    });
    const onSubmit: SubmitHandler<notification> = async (data) => {
        try {
            console.log(data);
        } catch (error: any) {
            alert(error.message);
        }
    }
    return (
        <article className="profile notifications" role="tabpanel" id="tab-notifications">
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend>Notifications</legend>
                    <div className="field-row">
                        <input id="radio10" {...register("notificationOrdersStatus")} onChange={e => setValue("notificationOrdersStatus", !getValues().notificationOrdersStatus)} type="checkbox" name="fieldset-example2"/>
                        <label htmlFor="radio10">Уведомлять меня о статусе заказов</label>
                    </div>
                    <div className="field-row">
                        <input id="radio11" {...register("notificationCommentsStatus")} onChange={e => setValue("notificationCommentsStatus", !getValues().notificationCommentsStatus)} type="checkbox" name="fieldset-example2"/>
                        <label htmlFor="radio11">Уведомлять меня об ответах на комментарии</label>
                    </div>
                    <div className="field-row">
                        <input id="radio12" {...register("notificationMessagesFromAdminStatus")} onChange={e => setValue("notificationMessagesFromAdminStatus", !getValues().notificationMessagesFromAdminStatus)} type="checkbox" name="fieldset-example2"/>
                        <label htmlFor="radio12">Уведомлять меня о сообщениях от администратора</label>
                    </div>
                    <div className="field-row">
                        <input id="radio13" {...register("notificationNewItemsStatus")} onChange={e => setValue("notificationNewItemsStatus", !getValues().notificationNewItemsStatus)} type="checkbox" name="fieldset-example2"/>
                        <label htmlFor="radio13">Уведомлять меня о новых товарах</label>
                    </div>
                </fieldset>
                <button type="submit">Save</button>
            </form>
        </article>
    )
}