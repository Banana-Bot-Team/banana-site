import { Controller } from '@climba03003/mongodb-utilities';
import { Checklist } from '../schemas/checklist';

export class ChecklistController extends Controller<Partial<Checklist>> {
  constructor() {
    super('checklists');
  }
}
