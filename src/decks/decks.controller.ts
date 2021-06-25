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
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import OptionalJwtAuthGuard from '../auth/guards/optional-jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request';
import { OptionallyAuthenticatedRequest } from '../auth/interfaces/optionally-authenticated-request';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { DeckIdDto } from './dto/deck-id.dto';
import { FindAllDecksDto } from './dto/find-all-decks.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private decks: DecksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a deck' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiResponse({
    status: 201,
    description: 'The deck was successfully created.',
  })
  @ApiResponse({
    status: 403,
    description:
      'The client does not have permission to create a deck for the specified author.',
  })
  @ApiResponse({
    status: 409,
    description:
      'The attempt to create a deck has failed. A deck with the specified ID already exists.',
  })
  async create(
    @Req() { user: { accessToken } }: AuthenticatedRequest,
    @Body() dto: CreateDeckDto,
  ) {
    const { data, status } = await this.decks.create(dto, accessToken);
    if (status === 201) {
      return data?.[0];
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
  @ApiOperation({ summary: 'Retrieve a list of decks' })
  @ApiResponse({
    status: 200,
    description: 'The query was successful.',
  })
  async findAll(
    @Req() req: OptionallyAuthenticatedRequest,
    @Query() dto: FindAllDecksDto,
  ) {
    const { data, status } = await this.decks.findAll(
      dto,
      req.user?.accessToken,
    );

    if (status === 200) {
      return data;
    }

    throw new InternalServerErrorException();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a deck' })
  @ApiResponse({
    status: 200,
    description: 'The deck specified was found',
  })
  @ApiResponse({
    status: 404,
    description: 'No deck with the given ID was found.',
  })
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
    return data[0];
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a deck' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'The deck was successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: `The attempt to modify the specified deck has failed due to insufficient permissions.`,
  })
  @ApiResponse({
    status: 404,
    description:
      'The attempt to modify the specified deck has failed because it could not be found',
  })
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a deck' })
  @ApiBearerAuth()
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'The deck was successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description:
      'The attempt to delete the specified deck has failed due to insufficient permissions.',
  })
  @ApiResponse({
    status: 404,
    description: 'The specified deck could not be found.',
  })
  async delete(@Req() req: AuthenticatedRequest, @Param() { id }: DeckIdDto) {
    const { data, status } = await this.decks.delete(id, req.user.accessToken);

    if (status === 200 && data?.length) {
      return data[0];
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
