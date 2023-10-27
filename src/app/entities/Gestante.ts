export class Gestante {
    id: number = 0;
    name: string = '';
    email: string = '';
    cpf: string = '';
    password: string = '';
    gestanteAge:number = 0;
    gestanteAddress: string = '';
    gestanteBirthDate!: Date;
    gestantePhone: string ='';
    gestanteDum!: Date;
    gestanteBloodType!: string;
    idProfissional: number = 0;
    numberOfPregnancies: number = 0;
    normalDeliveries: number = 0;
    cesareanDeliveries: number = 0;
    abortions: number = 0;
    height: number = 0;
    weight: number = 0;
    profilePhoto!: string
    pressaoArterial: number = 0;
    batimentosCardiacos: number = 0;
    examesRealizados: string = '';
    diagnostico: string = '';
    prescricoesMedicas: string = '';
    dataConsulta!: Date;
    notificationUrl!:any;

}