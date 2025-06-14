export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  isServiceUser: boolean;
  createdAt: string;
  updatedAt: string;
  groupCount: number;
}
