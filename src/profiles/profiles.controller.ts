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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request';
import { FindAllProfilesResponse } from './responses/find-all-profiles.response';
import { FindAllProfilesDto } from './dto/find-all-profiles.dto';
import { ProfileIdDto } from './dto/profile-id.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';
import { ProfileResponse } from './responses/profile.response';
import { ApiFailedValidationResponse } from '../common/decorators/api-failed-validation-response.decorator';
import { ApiResourceNotFoundResponse } from '../common/decorators/api-resource-not-found.decorator';
import { ApiAuthenticatedEndpoint } from '../common/decorators/api-authenticated-endpoint.decorator';
import { ApiInsufficientPermissionsResponse } from '../common/decorators/api-insufficient-permissions-response.decorator';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private profiles: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of profiles' })
  @ApiOkResponse({
    description: 'The query was successful.',
    type: FindAllProfilesResponse,
  })
  @ApiFailedValidationResponse()
  async findAll(
    @Query() dto: FindAllProfilesDto,
  ): Promise<FindAllProfilesResponse> {
    const val = await this.profiles.findAll(dto);
    const { count, data, error } = val;
    if (error || data === null || count === null) {
      throw new InternalServerErrorException();
    }
    return { data, count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a profile' })
  @ApiOkResponse({
    description: 'The profile specified was found.',
    type: ProfileResponse,
  })
  @ApiResourceNotFoundResponse()
  async findOne(@Param() { id }: ProfileIdDto): Promise<ProfileResponse> {
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
  @ApiAuthenticatedEndpoint()
  @ApiOkResponse({
    description: 'The profile was successfully updated.',
    type: ProfileResponse,
  })
  @ApiFailedValidationResponse()
  @ApiInsufficientPermissionsResponse({
    description: `The client has insufficient permissions to modify the specified user's profile.`,
  })
  @ApiResourceNotFoundResponse()
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: ProfileIdDto,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
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
