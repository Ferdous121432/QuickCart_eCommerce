import { Inngest } from "inngest";
import dbConnect from "./db";
import User from "@/models/user";

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

    const userData = {
      id,
      email: email_addresses[0]?.email_address || "",
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
      phone: phone_numbers[0]?.phone_number,
    };

    await dbConnect();
    await User.findByIdAndUpdate(id, userData);
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

    await dbConnect();
    await User.findByIdAndDelete(id);
  }
);
