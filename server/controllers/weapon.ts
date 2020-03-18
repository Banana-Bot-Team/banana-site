import { Controller } from '@climba03003/mongodb-utilities';
import { Weapon } from '../schemas/weapon';

export class WeaponController extends Controller<Partial<Weapon>> {
  constructor() {
    super('weapons');
  }
}
