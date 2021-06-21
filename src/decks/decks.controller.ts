import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import OptionalJwtAuthGuard from '../auth/guards/optional-jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request';
import { OptionallyAuthenticatedRequest } from '../auth/interfaces/optionally-authenticated-request';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { DeckIdDto } from './dto/deck-id.dto';
import { FindAllDecksDto } from './dto/find-all-decks.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import * as camelCaseKeys from 'camelcase-keys';

@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private decks: DecksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  async create(
    @Req() { user: { accessToken } }: AuthenticatedRequest,
    @Body() dto: CreateDeckDto,
  ) {
    const { data, status } = await this.decks.create(dto, accessToken);
    if (status === 201) {
      return camelCaseKeys(data?.[0] ?? {}, { deep: true });
    }
    if (status === 403) {
      throw new ForbiddenException();
    }
    if (status === 409) {
      throw new ConflictException();
    }
    throw new InternalServerErrorException();
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Req() req: OptionallyAuthenticatedRequest,
    @Query() dto: FindAllDecksDto,
  ) {
    const { data, status } = await this.decks.findAll(
      dto,
      req.user?.accessToken,
    );

    if (status === 200) {
      return camelCaseKeys(data ?? {}, { deep: true });
    }

    throw new InternalServerErrorException();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Req() req: OptionallyAuthenticatedRequest,
    @Param() { id }: DeckIdDto,
  ) {
    const { error, data } = await this.decks.findOne(
      id,
      req?.user?.accessToken,
    );
    if (error) {
      throw new InternalServerErrorException();
    }
    if (!data?.length) {
      throw new NotFoundException();
    }
    return camelCaseKeys(data[0], { deep: true });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: DeckIdDto,
    @Body() dto: UpdateDeckDto,
  ) {
    const { data, status } = await this.decks.update(
      id,
      req.user.accessToken,
      dto,
    );

    if (status === 200 && data !== null) {
      return camelCaseKeys(data[0], { deep: true });
    }
    if (status === 403) {
      throw new ForbiddenException();
    }
    if (status === 404) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth()
  async delete(@Req() req: AuthenticatedRequest, @Param() { id }: DeckIdDto) {
    const { data, status } = await this.decks.delete(id, req.user.accessToken);

    if (status === 200 && data?.length) {
      return camelCaseKeys(data[0], { deep: true });
    }
    if (status === 200) {
      throw new NotFoundException();
    }
    if (status === 403) {
      throw new ForbiddenException();
    }
    throw new InternalServerErrorException();
  }
}
