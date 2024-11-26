import z from 'zod';

export const RoleSchema=z.object({
    role:z.enum(['patient','doctor'])
})