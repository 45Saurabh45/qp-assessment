import { Request, Response } from "express";
import { GroceryItem, Order, User } from "../models";
import axios from "axios";
import { generateToken, verifyToken } from "../utils";
import { JwtPayload } from "jsonwebtoken";

export class GroceryController {

    async getAll(request: Request, response: Response) {
        try {
            const items = await GroceryItem.findAll();
            return response.json(items);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching grocery items" });
        }
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;
        try {
            const item = await GroceryItem.findByPk(id);
            if (!item) {
                return response.status(404).json({ message: "Item not found" });
            }
            return response.json(item);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching the item" });
        }
    }

    async add(request: Request, response: Response) {
        const { name, price, quantity } = request.body;

        try {
            const token = request.headers.authorization?.split(" ")[1];
            if (!token) {
                return response.status(401).json({ message: "No token provided" });
            }
            const decoded = await verifyToken(token) as JwtPayload & { id: number; is_admin: boolean };
            if (!decoded || !decoded.role) {
                return response.status(403).json({ message: "Unauthorized Access" });
            }

            const newItem = await GroceryItem.create({ name, price, quantity });
            return response.status(201).json(newItem);
        } catch (error) {
            return response.status(500).json({ message: "Error adding the item" });
        }
    }

    async remove(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const token = request.headers.authorization?.split(" ")[1]; 
            if (!token) {
                return response.status(401).json({ message: "No token provided" });
            }

            const decoded = await verifyToken(token) as JwtPayload & { id: number; is_admin: boolean };
            if (!decoded || !decoded.role) {
                return response.status(403).json({ message: "Unauthorized Access" });
            }

            const itemToRemove = await GroceryItem.findByPk(id);
            if (!itemToRemove) {
                return response.status(404).json({ message: "Item not found" });
            }

            await itemToRemove.destroy();
            return response.status(200).json({ message: "Item removed successfully" });
        } catch (error) {
            return response.status(500).json({ message: "Error removing the item" });
        }
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const token = request.headers.authorization?.split(" ")[1]; 
            if (!token) {
                return response.status(401).json({ message: "No token provided" });
            }

            const decoded = await verifyToken(token) as JwtPayload & { id: number; is_admin: boolean };
            if (!decoded || !decoded.role) {
                return response.status(403).json({ message: "Unauthorized Access" });
            }

            const item = await GroceryItem.findByPk(id);
            if (!item) {
                return response.status(404).json({ message: "Item not found" });
            }

            await item.update(request.body);
            return response.status(200).json({ message: "Item updated successfully" });
        } catch (error) {
            return response.status(500).json({ message: "Error updating the item" });
        }
    }
}

export class OrderController {

    async getAll(request: Request, response: Response) {
        try {
            const orders = await Order.findAll();
            return response.json(orders);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching orders" });
        }
    }

    async place(request: Request, response: Response) {
        const { userName, groceryList } = request.body;

        try {
           
            for (const item of groceryList) {
                const { grocery_id, quantity } = item;
                const listedItem = await axios.get(`http://localhost:3000/getGroceryItemById/${grocery_id}`).then(res => res.data);

                if (listedItem.quantity < quantity) {
                    return response.status(400).json({ message: "Can't fulfill this order quantity" });
                } else {
                    await axios.put(`http://localhost:3000/updateGroceryItem/${grocery_id}`, {
                        quantity: listedItem.quantity - quantity
                    });
                }
            }

            const newOrder = await Order.create({
                userName,
                groceryList
            });

            return response.status(201).json(newOrder);
        } catch (error) {
            return response.status(500).json({ message: "Error placing the order" });
        }
    }
}

export class UserController {

    async getAll(request: Request, response: Response) {
        try {
            const users = await User.findAll();
            return response.json(users);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching users" });
        }
    }

    async getById(request: Request, response: Response) {
        const { id } = request.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return response.status(404).json({ message: "User not found" });
            }
            return response.json(user);
        } catch (error) {
            return response.status(500).json({ message: "Error fetching the user" });
        }
    }

    async createnewUser(request: Request, response: Response) {
        const { userName, password, is_admin } = request.body;
        try {
            const newUser = await User.create({ userName, password, is_admin });
            return response.status(201).json(newUser);
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Error creating user" });
        }
    }

    async remove(request: Request, response: Response) {
        const { id } = request.params;
        try {
            const userToRemove = await User.findByPk(id);
            if (!userToRemove) {
                return response.status(404).json({ message: "User does not exist" });
            }

            await userToRemove.destroy();
            return response.status(200).json({ message: "User has been removed" });
        } catch (error) {
            return response.status(500).json({ message: "Error removing the user" });
        }
    }

    async login(request: Request, response: Response) {
        const { userName, password } = request.body;
        try {
            const registeredUser = await User.findOne({ where: { userName, password } });
    
            if (!registeredUser) {
                return response.status(404).json({ message: "Invalid username or password" });
            }
    
            const user = registeredUser.get();
    
            const token = generateToken({ id: user.id, is_admin: user.is_admin });
            return response.json({ token });
        } catch (error) {
            return response.status(500).json({ message: "Error during login" });
        }
    }
    
}
