/**
 * osmose-api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { TypeActivitee } from './typeActivitee';
import { Inscription } from './inscription';
import { Aspect } from './aspect';
import { Centre } from './centre';


export interface Activitee { 
    id?: number;
    creation?: string;
    modification?: string | null;
    libelle: string | null;
    dateDebut: string;
    dateFin: string;
    description?: string | null;
    typeActivitee: TypeActivitee;
    centre: Centre;
    aspects?: Array<Aspect> | null;
    inscriptions?: Array<Inscription> | null;
}
