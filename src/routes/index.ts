import { Router } from "express";
import { GroceryController, OrderController, UserController  } from "../controllers";  
import { verifyToken, isAdmin } from '../middlewares';

const router = Router();   

const groceryController = new GroceryController();
const orderController = new OrderController();
const userController = new UserController();

// Grocery Routes
router.get("/getAllGroceryItems", verifyToken, (req, res) => groceryController.getAll(req, res));
router.get("/getGroceryItemById/:id", verifyToken, (req, res) => groceryController.getById(req, res));
router.post("/addGroceryItem",verifyToken, isAdmin, (req, res) => groceryController.add(req, res));
router.delete("/removeGroceryItem/:id",verifyToken, isAdmin, (req, res) => groceryController.remove(req, res));
router.put("/updateGroceryItem/:id",verifyToken, isAdmin, (req, res) => groceryController.update(req, res));


// Order Routes
router.get("/getAllOrders", verifyToken, (req, res) => orderController.getAll(req, res));
router.post("/placeOrder", verifyToken, (req, res) => orderController.place(req, res));

// User Routes
router.get("/getAllUsers", (req, res) => userController.getAll(req, res));
router.get("/getUserById/:id", verifyToken, (req, res) => userController.getById(req, res));
router.post("/addUser", (req, res) => userController.createnewUser(req, res));
router.delete("/removeUserById/:id", verifyToken, (req, res) => userController.remove(req, res));
router.post("/login", (req, res) => userController.login(req, res));
export default router;
