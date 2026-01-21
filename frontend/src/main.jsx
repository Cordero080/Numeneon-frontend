import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App.jsx";
// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { PostsProvider } from "./contexts/PostsContext";
import { FriendsProvider } from "./contexts/FriendsContext";
import { SearchProvider } from "./contexts/SearchContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PostsProvider>
      <FriendsProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </FriendsProvider>
    </PostsProvider>
  </AuthProvider>,
);
