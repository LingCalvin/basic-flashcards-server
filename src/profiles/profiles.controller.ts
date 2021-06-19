import {
  Body,
  ConflictException,
  Controller,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
  @ApiBearerAuth()
  @ApiCookieAuth()
  async create(@Req() req: any, @Body() dto: CreateProfileDto) {
    if (req.user.sub !== dto.userId) {
      throw new UnauthorizedException();
    }

    const { data, status } = await this.profiles.create(dto);

    if (status === 201) {
      return stripUpdatedAt(data[0]);
    }

    if (status === 409) {
      throw new ConflictException();
    }

    throw new InternalServerErrorException();
  }

  @Get()
  @ApiQuery({ type: FindAllProfilesDto })
  async findAll(@Query() dto: FindAllProfilesDto) {
    const val = await this.profiles.findAll(dto);
    const { count, data, error } = val;
    if (error) {
      throw new InternalServerErrorException();
    }
    return { data: data.map((profile) => stripUpdatedAt(profile)), count };
  }

  @Get(':id')
  async findOne(@Param() { id }: ProfileIdDto) {
    const { error, data } = await this.profiles.findOne(id);
    if (error) {
      throw new InternalServerErrorException();
    }
    if (data.length === 0) {
      throw new NotFoundException();
    }
    return stripUpdatedAt(data[0]);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  async update(
    @Req() req: any,
    @Param() { id }: ProfileIdDto,
    @Body() dto: UpdateProfileDto,
  ) {
    if (req.user.sub !== id) {
      throw new UnauthorizedException();
    }

    const { data, error, status } = await this.profiles.update(id, dto);

    if (status === 200) {
      return data;
    }

    if (error.code === '23503') {
      throw new NotFoundException();
    }

    throw new InternalServerErrorException();
  }
}
