export interface ResetPasswordRequest {
    id: number;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}