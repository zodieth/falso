import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import * as ActionTypes from "../features/ActionTypes";
import { RootState } from "./store";
import axios from "axios";

export const createProduct = (value: any) => {
  axios.post("https://henry-pf-back.up.railway.app/products", value);

  return {
    type: ActionTypes.CREATE_PRODUCT,
    payload: value,
  };
};

export const addToCart = (value: any) => {
  return {
    type: ActionTypes.ADD_TO_CART,
    payload: value,
  };
};

export const addCountCart = (productName: string) => {
  return {
    type: ActionTypes.ADD_COUNT,
    payload: { productName },
  };
};

export const removeCountCart = (productName: string, count: number) => {
  console.log(count);
  return {
    type: ActionTypes.REMOVE_COUNT,
    payload: { productName, count },
  };
};

export const deleteFromCart = (value: any) => {
  return {
    type: ActionTypes.DELETE_FROM_CART,
    payload: value,
  };
};

export const addProducts = (value: any) => {
  return {
    type: ActionTypes.PRODUCTS_ADD,
    payload: value,
  };
};

export const addProduct = (value: any) => {
  return {
    type: ActionTypes.PRODUCT_ADD,
    payload: value,
  };
};

export const productsLoading = () => ({
  type: ActionTypes.PRODUCT_LOADING,
});

export const productsFailed = (value: String) => ({
  type: ActionTypes.PRODUCT_FAILED,
  payload: value,
});

export const productsFilter = (
  value: String,
  // type: String,
  order: String,
  costMin: String,
  costMax: String,
  categorySearch: String,
  brand: String
) => {
  return {
    type: ActionTypes.PRODUCT_FILTER,
    payload: { value, order, costMin, costMax, categorySearch, brand },
  };
};

export const fetchProductsApi =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(productsLoading());

    return await axios
      .get("http://localhost:3001/products")
      .then(
        function (response) {
          if (response.data.length) return response;
          else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        function (error) {
          var errMess = new Error(error.message);
          throw errMess;
        }
      )
      .then((data) => dispatch(addProducts(data.data)));
  };

export const categoryBrands = (categorySearch: String, brand: String) => {
  return {
    type: ActionTypes.PRODUCT_FILTER,
    payload: { categorySearch, brand },
  };
};

//Marcas
export const addBrand = (value: any) => {
  return {
    type: ActionTypes.BRAND_ADD,
    payload: value,
  };
};

export const brandLoading = () => ({
  type: ActionTypes.BRAND_LOADING,
});

export const brandFailed = (value: String) => ({
  type: ActionTypes.BRAND_FAILED,
  payload: value,
});

export const fetchBrandApi =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(brandLoading());

    return await axios
      .get("https://henry-pf-back.up.railway.app/brands")
      .then(
        function (response) {
          if (response.data.length) return response;
          else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        function (error) {
          var errMess = new Error(error.message);
          throw errMess;
        }
      )
      .then((data) => dispatch(addBrand(data.data)))
      .catch((error) => dispatch(brandFailed(error.message)));
  };

//Categorias

export const addCategories = (value: any) => {
  return {
    type: ActionTypes.CATEGORIES_ADD,
    payload: value,
  };
};

export const addCategory = (value: any) => {
  return {
    type: ActionTypes.CATEGORY_ADD,
    payload: value,
  };
};

export const categoryLoading = () => ({
  type: ActionTypes.CATEGORY_LOADING,
});

export const categoryFailed = (value: String) => ({
  type: ActionTypes.CATEGORY_FAILED,
  payload: value,
});

export const fetchCategoryApi =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    dispatch(categoryLoading());

    return await axios
      .get("https://henry-pf-back.up.railway.app/category")
      .then(
        function (response) {
          if (response.data.length) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        function (error) {
          var errMess = new Error(error.message);
          throw errMess;
        }
      )
      .then((categories) => dispatch(addCategories(categories.data)))
      .catch((error) => dispatch(categoryFailed(error.message)));
  };

//MercadoPago

type Product = {
  name: String;
  price: Number;
  images: [String];
  count: number;
};

export const payMercadoPagoApi = (products: Product[]) => {
  return async (dispatch: any) => {
    try {
      const response = await fetch(
        "https://henry-pf-back.up.railway.app/api/pay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(products),
        }
      );

      if (!response.ok) {
        throw new Error("Error loading countries");
      }

      const data = await response.json();
      return data;

      // despacha una acción con la respuesta del servidor
      //dispatch({ type: 'PAYMENT_SUCCESS', payload: data });
    } catch (error) {
      // despacha una acción con el error
      //dispatch({ type: 'PAYMENT_ERROR', payload: error });
    }
  };
};

//Category admin

export const postCateogry =
  (
    name: string,
    description: string,
    father: any = null
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(categoryLoading());

    if (father === "") father = null;

    const newCategory = {
      name: name,
      description: description,
      father: father,
    };

    return axios
      .post("https://henry-pf-back.up.railway.app/category", newCategory)
      .then((response) => {
        dispatch(addCategory(response.data));
      })
      .catch((error) => {
        console.log("Post activity", error.message);
        dispatch(categoryFailed(error.message));
      });
  };

export const deleteCategory = (value: any) => {
  return {
    type: ActionTypes.CATEGORY_DELETE,
    payload: value,
  };
};

export const deleteCateogry =
  (id: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(categoryLoading());

    return axios
      .delete(`https://henry-pf-back.up.railway.app/${id}`, {})
      .then(
        (response) => {
          if (response.data) {
            dispatch(deleteCategory(id));
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .catch((error) => {
        console.log("Delete category", error.message);
        dispatch(categoryFailed(error.message));
      });
  };

export const updateCategory = (value: any) => {
  return {
    type: ActionTypes.CATEGORY_UPDATE,
    payload: value,
  };
};

export const putCateogry =
  (
    id: string,
    category: any
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(categoryLoading());

    return axios
      .put("https://henry-pf-back.up.railway.app/category/" + id, category)
      .then(
        (response) => {
          if (response.status) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => {
        dispatch(updateCategory(response.data));
      })
      .catch((error) => {
        console.log("put category", error.message);
        dispatch(categoryFailed(error.message));
      });
  };

//Brand admin

export const postBrand =
  (name: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(brandLoading());

    const newBrand = {
      name: name,
    };

    return fetch("https://henry-pf-back.up.railway.app/brands", {
      method: "POST",
      body: JSON.stringify(newBrand),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => response.json())
      .then((response) => {
        dispatch(addBrand(response));
      })
      .catch((error) => {
        console.log("Post brand", error.message);
        dispatch(brandFailed(error.message));
      });
  };

export const deleteBrand = (value: any) => {
  return {
    type: ActionTypes.BRAND_DELETE,
    payload: value,
  };
};

export const deleteBrandApi =
  (id: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(brandLoading());

    return fetch(`https://henry-pf-back.up.railway.app/brands/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(
        (response) => {
          if (response.ok) {
            dispatch(deleteBrand(id));
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .catch((error) => {
        console.log("Delete brand", error.message);
        dispatch(brandFailed(error.message));
      });
  };

export const updateBrand = (value: any) => {
  return {
    type: ActionTypes.BRAND_UPDATE,
    payload: value,
  };
};

export const putBrand =
  (id: string, brand: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(categoryLoading());

    return axios
      .put(`https://henry-pf-back.up.railway.app/brands/${id}`, brand)
      .then(
        (response) => {
          if (response.status) {
            return response
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => {
        dispatch(updateBrand(response.data));
      })
      .catch((error) => {
        console.log("Delete category", error.message);
        dispatch(categoryFailed(error.message));
      });
  };

//Product admin

export const postProduct =
  (
    newProduct: any
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(productsLoading());
    
    return axios
      .post("http://localhost:3001/products", newProduct)
      .then((response) => {
        dispatch(addProduct(response.data));
      })
      .catch((error) => {
        console.log("Post activity", error.message);
        dispatch(productsFailed(error.message));
      });
  };

export const deleteProduct = (value: any) => {
  return {
    type: ActionTypes.CATEGORY_DELETE,
    payload: value,
  };
};

export const updateProduct = (value: any) => {
  return {
    type: ActionTypes.PRODUCT_UPDATE,
    payload: value,
  };
};

export const putProduct =
  (
    id: string,
    product: any
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch(productsLoading());
    console.log(product)
    return axios
      .put("http://localhost:3001/product/" + id, product)
      .then(
        (response) => {
          if (response.status) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            throw error;
          }
        },
        (error) => {
          throw error;
        }
      )
      .then((response) => {
        dispatch(updateProduct(response.data));
      })
      .catch((error) => {
        console.log("PUT product", error.message);
        dispatch(productsFailed(error.message));
      });
  };

