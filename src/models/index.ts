import { DataTypes } from "sequelize";
import { sequelize } from "./database";

// GroceryItem Model
const GroceryItem = sequelize.define("GroceryItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "grocery_items", 
  timestamps: true, 
});


const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "orders",
  timestamps: true, 
});


const Item = sequelize.define("Item", {
  grocery_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  grocery_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "orders", 
      key: "order_id", 
    },
    onDelete: "CASCADE", 
    onUpdate: "CASCADE", 
  },
}, {
  tableName: "items",
  timestamps: true, 
});

// User Model
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: "users",
  timestamps: true, 
});

Order.hasMany(Item, { foreignKey: "order_id", onDelete: "CASCADE" });
Item.belongsTo(Order, { foreignKey: "order_id" });

GroceryItem.hasMany(Item, { foreignKey: "grocery_id", onDelete: "CASCADE" });
Item.belongsTo(GroceryItem, { foreignKey: "grocery_id" });

export { GroceryItem, Order, Item, User };
