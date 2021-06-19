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

  private get qbAnon() {
    return this.supabase.anon.from<definitions['profiles']>('profiles');
  }

  private get qbService() {
    return this.supabase.service.from<definitions['profiles']>('profiles');
  }

  create({ userId: id, ...rest }: CreateProfileDto) {
    this.qbAnon.select(undefined).match({ id });
    return this.qbService.insert({ id, ...rest });
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
    const query = this.qbAnon
      .select(undefined, { count: 'exact' })
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
    return this.qbAnon.select(undefined).match({ id });
  }

  update(id: string, dto: UpdateProfileDto) {
    return this.qbService.update({ id, ...dto });
  }

  delete(id: string) {
    return this.qbService.delete().match({ id });
  }
}
