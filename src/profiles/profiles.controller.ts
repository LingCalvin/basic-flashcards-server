import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
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
import { stripUpdatedAt } from '../common/utils/metadata.utils';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FindAllProfilesDto } from './dto/find-all-profiles.dto';
import { ProfileIdDto } from './dto/profile-id.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a profile' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The profile was successfully created.',
  })
  @ApiResponse({
    status: 403,
    description:
      'The client does not have permission to create a profile for the specified user.',
  })
  @ApiResponse({
    status: 409,
    description:
      'The attempt to create a profile failed. The user specified already has a profile.',
  })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateProfileDto,
  ) {
    if (req.user.sub !== dto.userId) {
      throw new UnauthorizedException();
    }

    const { data, status } = await this.profiles.create(
      dto,
      req.user.accessToken,
    );

    if (status === 201 && data !== null) {
      return stripUpdatedAt(data[0]);
    }

    if (status === 409) {
      throw new ConflictException();
    }

    throw new InternalServerErrorException();
  }

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
    return { data: data?.map((profile) => stripUpdatedAt(profile)), count };
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
    return stripUpdatedAt(data[0]);
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
      return stripUpdatedAt(data[0]);
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
