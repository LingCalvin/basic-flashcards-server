import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import OptionalJwtAuthGuard from '../auth/guards/optional-jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request';
import { OptionallyAuthenticatedRequest } from '../auth/interfaces/optionally-authenticated-request';
import { ApiAuthenticatedEndpoint } from '../common/decorators/api-authenticated-endpoint.decorator';
import { ApiErrorResponse } from '../common/decorators/api-error-response.decorator';
import { ApiFailedValidationResponse } from '../common/decorators/api-failed-validation-response.decorator';
import { ApiInsufficientPermissionsResponse } from '../common/decorators/api-insufficient-permissions-response.decorator';
import { ApiOptionallyAuthenticatedEndpoint } from '../common/decorators/api-optionally-authenticated-endpoint.decorator';
import { ApiResourceNotFoundResponse } from '../common/decorators/api-resource-not-found.decorator';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { DeckIdDto } from './dto/deck-id.dto';
import { FindAllDecksDto } from './dto/find-all-decks.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { DeckResponse } from './responses/deck.response';
import { FindAllDecksResponse } from './responses/find-all-decks.response';

@ApiTags('decks')
@Controller('decks')
export class DecksController {
  constructor(private decks: DecksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a deck' })
  @ApiAuthenticatedEndpoint()
  @ApiCreatedResponse({
    description: 'The deck was successfully created.',
    type: DeckResponse,
  })
  @ApiFailedValidationResponse()
  @ApiInsufficientPermissionsResponse({
    description:
      'The client does not have permission to create a deck for the specified author.',
  })
  @ApiErrorResponse({
    status: HttpStatus.CONFLICT,
    description:
      'The attempt to create a deck has failed. A deck with the specified ID already exists.',
  })
  async create(
    @Req() { user: { accessToken } }: AuthenticatedRequest,
    @Body() dto: CreateDeckDto,
  ): Promise<DeckResponse> {
    const { data, status } = await this.decks.create(dto, accessToken);
    if (status === HttpStatus.CREATED && data !== null) {
      return data[0];
    }
    if (status === HttpStatus.FORBIDDEN) {
      throw new ForbiddenException();
    }
    if (status === HttpStatus.CONFLICT) {
      throw new ConflictException();
    }
    throw new InternalServerErrorException();
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOptionallyAuthenticatedEndpoint()
  @ApiOperation({ summary: 'Retrieve a list of decks' })
  @ApiOkResponse({
    description: 'The query was successful.',
    type: FindAllDecksResponse,
  })
  @ApiFailedValidationResponse()
  async findAll(
    @Req() req: OptionallyAuthenticatedRequest,
    @Query() dto: FindAllDecksDto,
  ): Promise<FindAllDecksResponse> {
    const { count, data, status } = await this.decks.findAll(
      dto,
      req.user?.accessToken,
    );

    if (status === HttpStatus.OK && data !== null && count !== null) {
      return { data, count };
    }

    throw new InternalServerErrorException();
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOptionallyAuthenticatedEndpoint()
  @ApiOperation({ summary: 'Retrieve a deck' })
  @ApiOkResponse({
    description: 'The deck specified was found',
    type: DeckResponse,
  })
  @ApiFailedValidationResponse()
  @ApiResourceNotFoundResponse('Deck')
  async findOne(
    @Req() req: OptionallyAuthenticatedRequest,
    @Param() { id }: DeckIdDto,
  ): Promise<DeckResponse> {
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
  @ApiAuthenticatedEndpoint()
  @ApiOkResponse({
    description: 'The deck was successfully updated.',
    type: DeckResponse,
  })
  @ApiFailedValidationResponse()
  @ApiResourceNotFoundResponse()
  @ApiInsufficientPermissionsResponse()
  async update(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: DeckIdDto,
    @Body() dto: UpdateDeckDto,
  ): Promise<DeckResponse> {
    const { data, status } = await this.decks.update(
      id,
      req.user.accessToken,
      dto,
    );

    if (status === HttpStatus.OK && data !== null) {
      return data[0];
    }
    if (status === HttpStatus.FORBIDDEN) {
      throw new ForbiddenException();
    }
    if (status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException();
    }
    throw new InternalServerErrorException();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a deck' })
  @ApiAuthenticatedEndpoint()
  @ApiOkResponse({
    description: 'The deck was successfully deleted.',
    type: DeckResponse,
  })
  @ApiFailedValidationResponse()
  @ApiInsufficientPermissionsResponse()
  @ApiResourceNotFoundResponse('Deck')
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param() { id }: DeckIdDto,
  ): Promise<DeckResponse> {
    const { data, status } = await this.decks.delete(id, req.user.accessToken);

    if (status === HttpStatus.OK && data?.length) {
      return data[0];
    }
    if (status === HttpStatus.OK) {
      throw new NotFoundException();
    }
    if (status === HttpStatus.FORBIDDEN) {
      throw new ForbiddenException();
    }
    throw new InternalServerErrorException();
  }
}
