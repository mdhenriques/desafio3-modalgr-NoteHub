import { Body, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/createUser.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from "./dto/loginUser.dto";


@Injectable()
export class UserService {

    async create(newUser: CreateUserDTO): Promise<{ status: string, message: string}>{
        try {                  
            const saltOrRounds = 10;
            newUser.password = await bcrypt.hash(newUser.password, saltOrRounds);
            await User.create({...newUser});

            return { status: 'success', message: 'User created successfully.'}

        } catch (err) {            
            console.error('Error creating user: ', err);
            return { status: 'error', message: 'An error occurred while creating the user.'}
        }
    }

    async login(loginData: LoginUserDTO): Promise<{ status: string, message: string}> {
        try {
            const existingUser = await User.findOne({
                where: {
                  username: loginData.username,
                },
            });

            if(!existingUser) {
                return { status: 'error', message: 'Invalid username.'};
            }
            const validPassword = await bcrypt.compare(loginData.password, existingUser.password);

            if(!validPassword) {
                return { status: 'error', message: 'Invalid password'};
            }

            return { status: 'success', message: 'Success!'};

        } catch (err) {

        }
    }

    async getAllUsers(): Promise<User[]> {
        return User.findAll();
    }
}