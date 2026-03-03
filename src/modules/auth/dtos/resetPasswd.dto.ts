// src/modules/auth/dtos/resetPasswd.dto.ts
import { z } from 'zod';

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'O token de recuperação é obrigatório.'),
    newPassword: z.string()
        .min(6, 'A nova senha deve ter pelo menos 6 caracteres.')
        .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula.')
        .regex(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um caracter especial.')
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;