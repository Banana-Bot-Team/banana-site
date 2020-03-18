import { Controller } from '@climba03003/mongodb-utilities';
import { Character } from '../schemas/character';

export class CharacterController extends Controller<Partial<Character>> {
  constructor() {
    super('characters');
  }
}
