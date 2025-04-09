import { Sequelize, DataTypes,Model, Optional } from "sequelize";
import sequelize from "./dbConfig";

interface CoinsTransactionAttributes {
    transaction_id: number;
    user_id: number;
    amount:string;
    transaction_type: number;
    created_at: Date;
}

interface CoinsTransactionCreationAttributes extends Optional<CoinsTransactionAttributes, "transaction_id"| "created_at"> {}

class CoinsTransaction extends Model<CoinsTransactionAttributes, CoinsTransactionCreationAttributes> implements CoinsTransactionAttributes {
    public transaction_id!: number;
    public user_id!: number;
    public amount!: string;
    public transaction_type!: number;
    public created_at!: Date;

    static associate(models: any) {
        CoinsTransaction.belongsTo(models.User, { foreignKey: "user_id" });
    }
}
CoinsTransaction.init(
    {
        transaction_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        transaction_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "coins_transaction",
        timestamps: false,
        underscored: true,
    }
);

export { CoinsTransaction };

