export * from './conference.service';
import { ConferenceService } from './conference.service';
export * from './email.service';
import { EmailService } from './email.service';
export * from './registre.service';
import { RegistreService } from './registre.service';
export * from './sysAdmin.service';
import { SysAdminService } from './sysAdmin.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [ConferenceService, EmailService, RegistreService, SysAdminService, UserService];
