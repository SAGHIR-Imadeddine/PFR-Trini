import { ObjectId } from "mongoose";
import { UserRole } from "src/users/entities/user.entity";
import { Types } from "mongoose";

 export interface Payload {
    id          : ObjectId,
    name        : string,
    email       : string,
    role        : UserRole,
    gyms?       : Types.ObjectId[]
}