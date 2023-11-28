import User from "@models/user";
const { connectToDB } = require("@utils/database");

// GET read
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const user = await User.findById(params.id);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch user", { status: 500 });
  }
};
