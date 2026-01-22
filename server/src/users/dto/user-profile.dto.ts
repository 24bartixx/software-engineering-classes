export class UserProfileDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  addressCountry: string;
  addressState: string;
  addressPostalCode: string;
  addressCity: string;
  addressStreet: string;
  addressNumber: string;
  addressApartment: string;
  employeeSince: string;
  lastModification: string;
  branches: string[];
  departments: string[];
  systemRole: string;
}
