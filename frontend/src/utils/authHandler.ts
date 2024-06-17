import { models } from "../types/models"

export default async function authHandler(error: any) {
    let storedId: string = localStorage.getItem("default_id") as string
    let storedRole: models.UserEntity.Auth.Role = localStorage.getItem("default_role") as models.UserEntity.Auth.Role
    if(!(storedId && storedRole)) {
        const user = await JSON.parse(error)
        localStorage.setItem("default_id", user.id)
        localStorage.setItem("default_role", user.role)
    }

}