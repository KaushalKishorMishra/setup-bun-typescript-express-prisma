import vine from '@vinejs/vine'

export class UserValidation {
    static get_user_by_id = vine.object({
        id: vine.string().uuid(),
    })

    static get_user_by_email = vine.object({
        email: vine.string().email(),
    })

    static create_user = vine.object({
        name: vine.string().optional(),
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(32).alphaNumeric({
            allowDashes: true,
            allowSpaces: false,
            allowUnderscores: true,
        }).confirmed(),
        phone: vine.string().minLength(10).maxLength(10),
        role: vine.enum(["USER", "ADMIN",]),
        address: vine.string().optional(),
        avatar: vine.string().optional(),
        is_verified: vine.boolean().optional(),
    })

    static update_user = vine.object({
        name: vine.string().optional(),
        email: vine.string().email().optional(),
        password: vine.string().minLength(8).maxLength(32).alphaNumeric({
            allowDashes: true,
            allowSpaces: false,
            allowUnderscores: true,
        }).confirmed().optional(),
        phone: vine.string().minLength(10).maxLength(10).optional(),
        address: vine.string().optional(),
        avatar: vine.string().optional(),
        is_verified: vine.boolean().optional(),
    })

    static soft_delete_user = vine.object({
        id: vine.string().uuid(),
    })

    static restore_user = vine.object({
        id: vine.string().uuid()
    })

    static login = vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(8).maxLength(32).alphaNumeric({
            allowDashes: true,
            allowSpaces: false,
            allowUnderscores: true,
        }),
    })

    static logout = vine.object({
        token: vine.string(),
    })

}