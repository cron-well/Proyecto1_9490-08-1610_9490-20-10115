import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    producto:[],
    nombre: String,
    marca: String,
    disponibilidad: String,
    descuento: Number,
    precioDescuento: Number,
    imagen: String,
    descripcion: String,
    cantidad: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Product", productSchema);
