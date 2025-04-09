import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface ExpertQuestionMapAttributes {
    map_id: number;
    question_id: number;
    user_id: number;
    created_at:Date;
}

interface ExpertQuestionMapCreationAttributes extends Optional<ExpertQuestionMapAttributes, "map_id" |"created_at"> {}

class ExpertQuestionMap extends Model<ExpertQuestionMapAttributes, ExpertQuestionMapCreationAttributes>
    implements ExpertQuestionMapAttributes {
    public map_id!: number;
    public question_id!: number;
    public user_id!: number;
    public created_at!:Date;

    static associate(models: any){
        ExpertQuestionMap.belongsTo(models.Question, { foreignKey: "question_id" });
        ExpertQuestionMap.belongsTo(models.User, { foreignKey: "user_id" });
    }
}

ExpertQuestionMap.init({
    map_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'expert_question_map',
    timestamps: false
});

export { ExpertQuestionMap };
