import {z} from "zod"

export const Vital_sign_types=z.object({
    name:z.string(),
    unit:z.string()
})

