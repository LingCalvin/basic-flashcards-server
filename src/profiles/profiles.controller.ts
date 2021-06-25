import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request';
import { FindAllProfilesDto } from './dto/find-all-profiles.dto';
import { ProfileIdDto } from './dto/profile-id.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of profiles' })
  @ApiResponse({
    status: 200,
    description: 'The query was successful.',
  })
  async findAll(@Query() dto: FindAllProfilesDto) {
    const val = await this.profiles.findAll(dto);
    const { count, data, error } = val;
    if (error) {
      throw new InternalServerErrorException();
    }
    return { data, count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a profile' })
  @ApiResponse({
    status: 200,
    description: 'The profile specified was found',
  })
  @ApiResponse({
    status: 404,
    description: 'No profile with the given ID was found.',
  })
  async findOne(@Param() { id }: ProfileIdDto) {
    const { error, data } = await this.profiles.findOne(id);
    if (error) {
      throw new InternalServerErrorException();
    }
    if (!data?.length) {
      throw new NotFoundException();
    }
    return data[0];
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a profile' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'The profile was successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: `The attempt to modify the profile failed due to the client having insufficient permissions to modify the specified user's profile.`,
  })
  @ApiResponse({
    status: 404,
    description:
      'The attempt to modify the specified profile has failed because it could not be found',
  })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: ProfileIdDto,
    @Body() dto: UpdateProfileDto,
  ) {
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }

    const { data, status } = await this.profiles.update(
      id,
      dto,
      req.user.accessToken,
    );

    if (status === 200 && data !== null) {
      return data[0];
    }
    if (status === 403) {
      throw new ForbiddenException();
    }
    if (status === 404) {
      throw new NotFoundException();
    }

    throw new InternalServerErrorException();
  }
}
