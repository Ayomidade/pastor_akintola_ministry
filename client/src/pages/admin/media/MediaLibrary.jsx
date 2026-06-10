import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { mediaService } from "../../../services/media.service.js";
import ConfirmModal from "../../../components/shared/ConfirmModal.jsx";
import {
  Upload, Trash2, Image, Plus, Edit2,
  ArrowLeft, Grid, ChevronRight, Check, X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MediaLibrary() {
  const { collectionId } = useParams();
  return collectionId
    ? <CollectionDetail collectionId={collectionId} />
    : <CollectionList />;
}

// ─── List of all collections ──────────────────────────────────────
function CollectionList() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    mediaService.getCollections()
      .then((res) => setCollections(res.data.collections || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newForm.title.trim()) return;
    setSaving(true);
    try {
      await mediaService.createCollection(newForm);
      toast.success("Collection created.");
      setCreating(false);
      setNewForm({ title: "", description: "" });
      loadCollections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create collection.");
    } finally { setSaving(false); }
  };

  const handleUpdate = async (id) => {
    setSaving(true);
    try {
      await mediaService.updateCollection(id, editForm);
      toast.success("Collection updated.");
      setEditingId(null);
      loadCollections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update collection.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await mediaService.deleteCollection(deleting);
      toast.success("Collection and all images deleted.");
      setDeleting(null);
      loadCollections();
    } catch { toast.error("Could not delete collection."); }
  };

  const startEdit = (col) => {
    setEditingId(col._id);
    setEditForm({ title: col.title, description: col.description || "" });
  };

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>Media Collections</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Plus size={16} /> New Collection
        </button>
      </div>

      {/* Create collection form */}
      {creating && (
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: 24, border: "2px solid var(--gold)", marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>Create New Collection</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="create-form-grid">
              <div className="form-group">
                <label className="form-label">Collection Name *</label>
                <input className="form-input" value={newForm.title}
                  onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Sunday Service, Annual Convention"
                  required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={newForm.description}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional short description" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? "Creating..." : "Create Collection"}
              </button>
              <button type="button" onClick={() => setCreating(false)}
                className="btn btn-outline btn-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collections grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 240, borderRadius: "var(--radius-lg)" }} />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 64, textAlign: "center" }}>
          <Grid size={48} color="var(--border)" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>No collections yet.</p>
          <button onClick={() => setCreating(true)} className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Create your first collection
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {collections.map((col) => (
            <div key={col._id}
              style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden", transition: "var(--transition)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-md)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>

              {/* Cover */}
              <div
                onClick={() => navigate(`/admin/gallery/${col._id}`)}
                style={{ height: 160, background: "var(--navy)", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                {col.coverImage ? (
                  <img src={col.coverImage.url} alt={col.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image size={36} color="rgba(201,168,76,0.3)" />
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: 8, right: 8,
                  background: "rgba(13,27,42,0.8)",
                  padding: "3px 10px", borderRadius: 20,
                  fontSize: 11, fontWeight: 700, color: "var(--gold)",
                }}>
                  {col.imageCount} photo{col.imageCount !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Info / Edit */}
              <div style={{ padding: "14px 16px" }}>
                {editingId === col._id ? (
                  <div>
                    <input
                      className="form-input"
                      value={editForm.title}
                      onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                      style={{ marginBottom: 8, fontSize: 13 }}
                      autoFocus
                    />
                    <input
                      className="form-input"
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Description"
                      style={{ marginBottom: 12, fontSize: 13 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleUpdate(col._id)}
                        style={{ background: "var(--gold)", border: "none", borderRadius: "var(--radius)", padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--navy)", display: "flex", alignItems: "center", gap: 4 }}
                        disabled={saving}>
                        <Check size={12} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)}
                        style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "6px 12px", cursor: "pointer", fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div
                      onClick={() => navigate(`/admin/gallery/${col._id}`)}
                      style={{ flex: 1, cursor: "pointer" }}>
                      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: col.description ? 3 : 0 }}>{col.title}</p>
                      {col.description && (
                        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                          {col.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                      <button onClick={() => startEdit(col)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleting(col._id)}
                        style={{ background: "none", border: "none", color: "#e53e3e", cursor: "pointer", padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Collection"
        message="This will permanently delete the collection and ALL images inside it from Cloudinary. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />

      <style>{`
        @media (max-width: 640px) {
          .create-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Individual collection detail — upload + manage images ─────────
function CollectionDetail({ collectionId }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [collection, setCollection] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [caption, setCaption] = useState("");

  const fetch = () => {
    setLoading(true);
    mediaService.getCollectionMedia(collectionId)
      .then((res) => {
        setCollection(res.data.collection);
        setImages(res.data.images || []);
      })
      .catch(() => navigate("/admin/gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [collectionId]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append("files", f));
      fd.append("collectionId", collectionId);
      if (caption.trim()) fd.append("caption", caption.trim());
      await mediaService.upload(fd);
      toast.success(`${files.length} image(s) uploaded.`);
      setCaption("");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      await mediaService.delete(deleting);
      toast.success("Image deleted.");
      setDeleting(null);
      fetch();
    } catch { toast.error("Delete failed."); }
  };

  const handleBulkDelete = async () => {
    try {
      await mediaService.deleteBulk(selected);
      toast.success(`${selected.length} image(s) deleted.`);
      setSelected([]);
      setBulkConfirm(false);
      fetch();
    } catch { toast.error("Bulk delete failed."); }
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid var(--border)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button onClick={() => navigate("/admin/gallery")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0 }}>
            <ArrowLeft size={14} /> All Collections
          </button>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>{collection?.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            {images.length} image{images.length !== 1 ? "s" : ""}
            {collection?.description && ` • ${collection.description}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {selected.length > 0 && (
            <button onClick={() => setBulkConfirm(true)} className="btn btn-danger btn-sm"
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Trash2 size={14} /> Delete {selected.length} selected
            </button>
          )}
          <button onClick={() => fileRef.current.click()} className="btn btn-primary"
            disabled={uploading}
            style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload Images"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: "none" }} />
        </div>
      </div>

      {/* Caption input for next upload */}
      <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", padding: "14px 18px", border: "1px solid var(--border)", marginBottom: 24, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          Caption for next upload
        </label>
        <input
          className="form-input"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="Optional — applies to all images in next upload batch"
          style={{ flex: 1, minWidth: 200 }}
        />
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: 64, textAlign: "center" }}>
          <Image size={48} color="var(--border)" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
            No images in this collection yet.
          </p>
          <button onClick={() => fileRef.current.click()} className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Upload size={14} /> Upload first images
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {images.map((img) => (
            <div key={img._id}
              style={{
                position: "relative", borderRadius: "var(--radius-lg)",
                overflow: "hidden", aspectRatio: "1",
                background: "var(--navy)",
                border: selected.includes(img._id)
                  ? "3px solid var(--gold)"
                  : "3px solid transparent",
                transition: "border-color 0.15s",
              }}>
              <img src={img.url} alt={img.caption || ""}
                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }}
                onClick={() => setLightbox(img)} />

              {/* Select checkbox */}
              <div style={{ position: "absolute", top: 8, left: 8 }}>
                <input type="checkbox"
                  checked={selected.includes(img._id)}
                  onChange={() => toggleSelect(img._id)}
                  onClick={e => e.stopPropagation()}
                  style={{ width: 18, height: 18, accentColor: "var(--gold)", cursor: "pointer" }} />
              </div>

              {/* Delete button */}
              <button onClick={e => { e.stopPropagation(); setDeleting(img._id); }}
                style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(229,62,62,0.9)", border: "none",
                  borderRadius: "50%", width: 28, height: 28,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "white",
                  opacity: 0, transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <Trash2 size={12} />
              </button>

              {img.caption && (
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  padding: "16px 8px 6px", fontSize: 11, color: "white",
                }}>
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(13,27,42,0.95)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          <img src={lightbox.url} alt={lightbox.caption || ""}
            style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: "var(--radius-lg)" }} />
          {lightbox.caption && (
            <p style={{ position: "absolute", bottom: 32, color: "var(--cream)", fontSize: 14 }}>
              {lightbox.caption}
            </p>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleting}
        title="Delete Image"
        message="This will permanently remove this image from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
      <ConfirmModal
        isOpen={bulkConfirm}
        title={`Delete ${selected.length} Images`}
        message="All selected images will be permanently deleted from Cloudinary. This cannot be undone."
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkConfirm(false)}
        confirmLabel="Delete All"
      />
    </div>
  );
}