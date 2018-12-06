import { SleepData } from "./sleep-data";

export class User {
    ID: number;
    FirstName: string;
    LastName: string;
    FullName: string;
    BirthDate: Date;
    ProfilePicture: string;
    SleepData: SleepData[];

    constructor(firstName: string, lastName: string, birthDate: Date) {
        //0 is for new Users
        this.ID = 0;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.FullName = firstName + " " + lastName;
        this.BirthDate = birthDate;
    }

    static createNewUser(user: any) {
        if(user == null) {
            return null;
        }
        var newUser = new User(user.FirstName, user.LastName, new Date(user.BirthDate));
        newUser.ProfilePicture = user.ProfilePicture;
        newUser.SleepData = user.SleepData;
        return newUser;
    }

    getFullName() {
        return this.FirstName + " " + this.LastName;
    }
}
