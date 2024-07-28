export * from './conference.service';
import { ConferenceService } from './conference.service';
export * from './sysAdmin.service';
import { SysAdminService } from './sysAdmin.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [ConferenceService, SysAdminService, UserService];
