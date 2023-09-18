import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: String,
    },
    {
        versionKey: true,
    }
);

export default mongoose.model("Compra", productSchema);
