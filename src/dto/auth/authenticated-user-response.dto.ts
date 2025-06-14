import type { PermissionEnum } from '@/enums/permissions.enum.ts';
import type { UserResponseDto } from '@/dto/user/user-response.dto.ts';

export interface AuthenticatedUserResponseDto extends UserResponseDto {
  permissions: PermissionEnum[];
}
