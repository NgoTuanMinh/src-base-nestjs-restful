import { Balence } from 'src/entities/balence.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Balence)
export class BalenceRepository extends Repository<Balence> {}
