import { IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  /**
   * The user's username.
   */
  @IsString()
  @Length(3, 256)
  username: string;
}
