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
import { TypeMembre } from './typeMembre';
import { Centre } from './centre';


export interface MembreOutput { 
    id?: number;
    nom: string | null;
    prenom: string | null;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    pays?: string | null;
    typeMembre: TypeMembre;
    centre?: Centre;
}
