import { Inngest } from "inngest";
import dbConnect from "./db";
import User from "@/models/user";
import Order from "@/models/order";

// Initialize Inngest with your project ID
// Replace 'quickcart-next' with your actual project ID

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//Inngest function to save user data to database

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      phone_numbers,
      image_url,
    } = event.data;

    const userData = {
      userID: id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
      phone: phone_numbers[0]?.phone_number,
    };

    await dbConnect();
    await User.create(userData);
  }
);

// Inngest function to update user data in database

export const syncUserUpdate = inngest.createFunction(
  {
    id: "sync-user-update",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      phone_numbers,
      image_url,
    } = event.data;

    let userID = id;

    const userData = {
      userID,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
      phone: phone_numbers[0]?.phone_number,
    };

    await dbConnect();
    await User.findOneAndUpdate({ userID }, userData, { new: true });
  }
);

// Inngest function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    let userID = id;

    await dbConnect();
    await User.findOneAndDelete({ userID });
  }
);

// Inngest function to handle user order creation
export const syncOrderCreation = inngest.createFunction(
  {
    id: "sync-order-creation",
    batchEvents: {
      maxBatchSize: 3,
      timeout: "5s",
    },
  },
  {
    event: "order/created",
  },
  async ({ events }) => {
    const orders = events.map((event) => {
      return {
        userID: event.data.userID,
        items: event.data.items,
        address: event.data.address,
        totalAmount: event.data.totalAmount,
        date: event.data.date,
      };
    });

    // Connect to the database
    await dbConnect();
    // Insert orders into the database
    await Order.insertMany(orders);

    return {
      success: true,
      message: "Orders synced successfully",
      orders,
    };
  }
);
