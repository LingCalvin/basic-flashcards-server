import { Inject, Injectable } from '@nestjs/common';
import { escapeLike } from '../common/utils/sql.utils';
import { SupabaseClient } from '../supabase/classes/supabase-client';
import { definitions } from '../supabase/interfaces/supabase';
import { CreateProfileDto } from './dto/create-profile.dto';
import { FindAllProfilesDto } from './dto/find-all-profiles.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(@Inject(SupabaseClient) private supabase: SupabaseClient) {}

  private queryAsAnon(token?: string) {
    return (token ? this.supabase.asUser(token) : this.supabase.anon).from<
      definitions['profiles']
    >('profiles');
  }

  create({ userId: id, ...rest }: CreateProfileDto, token: string) {
    return this.queryAsAnon(token)
      .insert({ id, ...rest })
      .select('id, username');
  }

  async findAll({
    id,
    username,
    usernameStartsWith,
    limit,
    offset,
    sort,
    orderBy,
  }: FindAllProfilesDto) {
    const query = this.queryAsAnon()
      .select('id, username', { count: 'exact' })
      .order(orderBy, { ascending: sort === 'asc' })
      .range(offset, offset + limit - 1);

    if (Array.isArray(id)) {
      query.in('id', id);
    } else if (id) {
      query.match({ id });
    }

    if (Array.isArray(username)) {
      query.in('username', username);
    } else if (username) {
      query.match({ id });
    }

    if (usernameStartsWith) {
      query.like('username', `${escapeLike(usernameStartsWith)}%`);
    }

    return query;
  }

  findOne(id: string) {
    return this.queryAsAnon().select(undefined).match({ id });
  }

  update(id: string, dto: UpdateProfileDto, token: string) {
    return this.queryAsAnon(token).update({ id, ...dto });
  }

  delete(id: string, token: string) {
    return this.queryAsAnon(token).delete().match({ id });
  }
}
