import product_model from "../Model/ProductModel.js"


export async function Addproduct(product) {
    

    const result = product_model.create(product);

    return result;
}

export async function viewproduct() {
    const result = product_model.find();

    return result;
}

export async function deletebyid(id) {
    
    const result = product_model.findByIdAndDelete(id)
    return result;
}

export async function getsingledeta(id) {
    
    const result = product_model.findById(id);

    return result;
}

export async function updatebyid(id , product) {
    
    

   const result =  await product_model.findOneAndUpdate(
    { _id: id },
    product,
    { new: true }
);
    return result
}

export async function findBySKU(sku) {
  return await product_model.findOne({ sku });
}