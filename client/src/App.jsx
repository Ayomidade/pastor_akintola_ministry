// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { VisitorAuthProvider } from "./context/VisitorAuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VisitorRoute from "./components/VisitorRoute.jsx";
import Navbar from "./components/shared/Navbar.jsx";
import Footer from "./components/shared/Footer.jsx";

// Public pages
import Home from "./pages/public/Home.jsx";
import Blog from "./pages/public/Blog.jsx";
import PostDetail from "./pages/public/PostDetail.jsx";
import Sermons from "./pages/public/Sermons.jsx";
import SermonDetail from "./pages/public/SermonDetail.jsx";
import Ebooks from "./pages/public/Ebooks.jsx";
import Events from "./pages/public/Events.jsx";
import Media from "./pages/public/Media.jsx";
import Contact from "./pages/public/Contact.jsx";
import Register from "./pages/public/Register.jsx";
import VisitorLogin from "./pages/public/VisitorLogin.jsx";
import Chat from "./pages/public/Chat.jsx";

// Admin pages
import AdminLogin from "./pages/admin/Login.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import PostList from "./pages/admin/posts/PostList.jsx";
import CreatePost from "./pages/admin/posts/CreatePost.jsx";
import EditPost from "./pages/admin/posts/EditPost.jsx";
import SermonList from "./pages/admin/sermons/SermonList.jsx";
import CreateSermon from "./pages/admin/sermons/CreateSermon.jsx";
import EditSermon from "./pages/admin/sermons/EditSermon.jsx";
import EbookList from "./pages/admin/ebooks/EbookList.jsx";
import UploadEbook from "./pages/admin/ebooks/UploadEbook.jsx";
import EditEbook from "./pages/admin/ebooks/EditEbook.jsx";
import EventList from "./pages/admin/events/EventList.jsx";
import CreateEvent from "./pages/admin/events/CreateEvent.jsx";
import EditEvent from "./pages/admin/events/EditEvent.jsx";
import MediaLibrary from "./pages/admin/media/MediaLibrary.jsx";
import Comments from "./pages/admin/Comments.jsx";
import Contacts from "./pages/admin/Contacts.jsx";
import Newsletter from "./pages/admin/Newsletter.jsx";
import Livestream from "./pages/admin/Livestream.jsx";
import ChatDashboard from "./pages/admin/chat/ChatDashboard.jsx";
import ChatWindow from "./pages/admin/chat/ChatWindow.jsx";
import About from "./pages/public/About.jsx";
import Donate from "./pages/public/Donate.jsx";
import Videos from "./pages/public/Videos.jsx";
import useScrollToTop from "./hooks/useScrollToTop.js";

function PublicLayout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuth = ["/visitor/login", "/visitor/register"].includes(
    location.pathname,
  );

  if (isAdmin || isAuth) return children;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 0 }}>{children}</main>
      <Footer />
    </>
  );
}

const AppRoutes = () => {
  useScrollToTop();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/sermons/:slug" element={<SermonDetail />} />
      <Route path="/ebooks" element={<Ebooks />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:slug" element={<Events />} />
      <Route path="/gallery" element={<Media />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/videos" element={<Videos />} />

      {/* Visitor auth */}
      <Route path="/visitor/register" element={<Register />} />
      <Route path="/visitor/login" element={<VisitorLogin />} />
      <Route
        path="/chat"
        element={
          <VisitorRoute>
            <Chat />
          </VisitorRoute>
        }
      />

      {/* Admin auth */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="posts/edit/:id" element={<EditPost />} />
        <Route path="sermons" element={<SermonList />} />
        <Route path="sermons/create" element={<CreateSermon />} />
        <Route path="sermons/edit/:id" element={<EditSermon />} />
        <Route path="ebooks" element={<EbookList />} />
        <Route path="ebooks/upload" element={<UploadEbook />} />
        <Route path="ebooks/edit/:id" element={<EditEbook />} />
        <Route path="events" element={<EventList />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/edit/:id" element={<EditEvent />} />
        <Route path="gallery" element={<MediaLibrary />} />
        <Route path="comments" element={<Comments />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="livestream" element={<Livestream />} />
        <Route path="chat" element={<ChatDashboard />} />
        <Route path="chat/:sessionId" element={<ChatWindow />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VisitorAuthProvider>
          <SocketProvider>
            <PublicLayout>
              <AppRoutes />
            </PublicLayout>
          </SocketProvider>
        </VisitorAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
