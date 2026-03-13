import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    date: {
      type: String
    },
    credentialLink: {
      type: String
    },
    image: {
      type: String
    }
  },
  { timestamps: true }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;