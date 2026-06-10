import api from "../api/axios.js";
export const mediaService = {
  // getAll: (params) => api.get("/media", { params }),
  // Collections
  getCollections: () => api.get("/media/collections"),
  getCollectionBySlug: (slug) => api.get(`/media/collections/${slug}`),
  getCollectionMedia: (collectionId) =>
    api.get(`media/collections/${collectionId}/images`),
  createCollection: (data) => api.post("/media/collections", data),
  updateCollection: (id) => api.put(`/media/collections/${id}`),
  deleteCollection: (id) => api.delete(`/media/collections/${id}`),

  // Images
  upload: (data) => api.post("/media", data),
  delete: (id) => api.delete(`/media/${id}`),
  deleteBulk: (ids) => api.delete("/media/bulk", { data: { ids } }),
};
