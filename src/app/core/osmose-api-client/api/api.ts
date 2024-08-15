export * from './conference.service';
import { ConferenceService } from './conference.service';
export * from './registre.service';
import { RegistreService } from './registre.service';
export * from './sysAdmin.service';
import { SysAdminService } from './sysAdmin.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [ConferenceService, RegistreService, SysAdminService, UserService];
