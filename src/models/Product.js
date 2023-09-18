import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
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

export default mongoose.model("carritoCompra", productSchema);
