// src/components/Header/Header.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/authContext";

import HeaderNav from "./HeaderNav";
import HeaderSearch from "./HeaderSearch";
import HeaderIcons from "./HeaderIcons";
import { useSearch } from "../../../context/SearchContext";

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { setSearchQuery } = useSearch();
  const [query, setQuery] = useState("");

  const handleTyping = (value) => {
    setQuery(value);

    if (value.trim() === "") {
      // RESET LANDING — FIX UTAMA
      setSearchQuery("");
      return; // stop live search agar nggak overwrite
    }

    // LIVE SEARCH
    setSearchQuery(value);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(query);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md bg-white">
      <div className="flex items-center justify-between px-8 py-4">

        <div
          className="font-bold text-xl cursor-pointer relative -top-1"
          onClick={() => {
            navigate("/");
            setQuery("");
            setSearchQuery(""); // reset jika klik logo
          }}
        >
          Kavva
        </div>

        <HeaderNav />

        <div className="flex items-center gap-4">
          <HeaderSearch
            query={query}
            setQuery={handleTyping}
            handleSearch={handleSearch}
          />

          <HeaderIcons user={user} />
        </div>

      </div>
    </header>
  );
}