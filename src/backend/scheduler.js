import { importCRMData } from 'backend/crmImport.js';

// paleidžiama kartą per valandą
export function schedule_import(event) {
    return importCRMData();
}
