const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({ config: Array }, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
