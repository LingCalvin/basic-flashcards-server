import { Inject, Injectable } from '@nestjs/common';
import { escapeLike } from '../common/utils/sql.utils';
import { SupabaseClient } from '../supabase/classes/supabase-client';
import { definitions } from '../supabase/interfaces/supabase';
import { CreateDeckDto } from './dto/create-deck.dto';
import { FindAllDecksDto } from './dto/find-all-decks.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { convertToCard } from './utils/card.utils';

@Injectable()
export class DecksService {
  constructor(@Inject(SupabaseClient) private supabase: SupabaseClient) {}

  private queryAsAnon(token?: string) {
    return (token ? this.supabase.asUser(token) : this.supabase.anon).from<
      definitions['decks']
    >('decks');
  }

  create(
    { authorId: author_id, cards, ...rest }: CreateDeckDto,
    token: string,
  ) {
    return this.queryAsAnon(token).insert({
      author_id,
      cards: cards.map(convertToCard),
      ...rest,
    });
  }

  findAll(dto: FindAllDecksDto, token?: string) {
    const query = this.queryAsAnon(token)
      .select()
      .order(dto.orderBy, { ascending: dto.sort === 'asc' })
      .range(dto.offset, dto.offset + dto.limit - 1);

    // Filter by ID
    if (Array.isArray(dto.id)) {
      query.in('id', dto.id);
    } else if (dto.id) {
      query.eq('id', dto.id);
    }

    // Filter by title
    if (Array.isArray(dto.title) && !dto.caseSensitive) {
      const filter = dto.title
        .map((title) => `title.ilike.${escapeLike(title)}`)
        .join(',');
      query.or(filter);
    } else if (Array.isArray(dto.title)) {
      query.in('title', dto.title);
    } else if (dto.title && !dto.caseSensitive) {
      query.ilike('title', escapeLike(dto.title));
    } else if (dto.title) {
      query.eq('title', dto.title);
    }

    // Filter by what the title starts with
    if (dto.titleStartsWith && !dto.caseSensitive) {
      query.ilike('title', `${escapeLike(dto.titleStartsWith)}%`);
    } else if (dto.titleStartsWith) {
      query.like('title', dto.titleStartsWith);
    }
    return query;
  }

  findOne(id: string, token?: string) {
    return this.queryAsAnon(token).select().match({ id });
  }

  update(id: string, token: string, { cards, ...rest }: UpdateDeckDto) {
    return this.queryAsAnon(token).update({
      id,
      cards: cards.map(convertToCard),
      ...rest,
    });
  }

  delete(id: string, token: string) {
    return this.queryAsAnon(token).delete().match({ id });
  }
}
