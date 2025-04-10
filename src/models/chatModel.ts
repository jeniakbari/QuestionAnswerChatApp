import { Sequelize,DataTypes,Model,Optional} from "sequelize";
import sequelize from './dbConfig'
import { User } from "./usersModel";
import { ForeignKey } from "sequelize-typescript";

interface ChatAttributes{
    message_id:number,
    question_id:number,
    sender_id:number,
    receiver_id:number,
    room_id:string,
    content:string,
    created_at:Date
}

interface ChatCreationAttributes extends Optional<ChatAttributes,"message_id"|"created_at">{}

class Chat extends Model<ChatAttributes,ChatCreationAttributes> implements ChatAttributes{
    public message_id!:number;
    public question_id!:number;
    public sender_id!:number;
    public receiver_id!:number;
    public room_id!:string;
    public content!:string;
    public created_at!:Date;

    static associate(models:any){
        Chat.belongsTo(models.User,{foreignKey:"sender_id", as: 'sender'});
        Chat.belongsTo(models.User,{foreignKey:"receiver_id",as: 'receiver'});
        Chat.belongsTo(models.Question,{foreignKey:"question_id"});
    }

}

Chat.init({
    message_id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    question_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    sender_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    receiver_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    room_id:{
        type: DataTypes.STRING,
        allowNull:false
    },
    content:{
        type: DataTypes.STRING,
        allowNull:false
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue:DataTypes.NOW
    },
},
{
    sequelize,
    tableName: 'chat_messages',
    timestamps: false,
}
)

export{Chat}