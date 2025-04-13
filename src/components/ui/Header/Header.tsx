import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import styles from "./Header.module.css";
import Menu from "./Menu";
import UserMenu from "./UserMenu";
import { useAuth } from "../../../context/AuthContext";
import { getAvatar } from "@/router/api";
import { IconExport, IconClose } from "@arco-design/web-react/icon";
import { Modal, Button } from "@arco-design/web-react";
import { useSearch } from './SearchContext';

const Header: React.FC = () => {
  const { searchText, setSearchText } = useSearch();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { longtoken } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const DEFAULT_AVATAR =
    "https://cdn.pixabay.com/photo/2018/05/31/15/06/see-no-evil-3444212_1280.jpg";
  const [avatar, setAvatar] = useState<string | null>(DEFAULT_AVATAR);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatarBlob = await getAvatar(longtoken as string);
        if (!avatarBlob) {
          setAvatar(DEFAULT_AVATAR);
          return;
        }
        if (avatar) {
          URL.revokeObjectURL(avatar);
        }
        const avatarUrl = URL.createObjectURL(avatarBlob);
        setAvatar(avatarUrl);
      } catch (error) {
        console.error("获取头像失败", error);
        setAvatar(DEFAULT_AVATAR);
      }
    };
    fetchAvatar();
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [longtoken]);
  const onSearch = () => {
    if (searchText.trim()) {
      const currentPath = location.pathname;
      if (currentPath.startsWith('/article')) {
          setSearchText(searchText.trim());  // 更新搜索文本
      } else if (currentPath.startsWith('/qa')) {
          setSearchText(searchText.trim());
      } else if (currentPath.startsWith('/teamup')) {
          setSearchText(searchText.trim());
      } else {
          setSearchText(searchText.trim());
      }
  }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const getSearchPlaceholder = () => {
    const currentPath = location.pathname;
    if (currentPath.startsWith("/article")) {
      return "搜索文章...";
    } else if (currentPath.startsWith("/qa")) {
      return "搜索问答...";
    } else if (currentPath.startsWith("/teamup")) {
      return "搜索组队...";
    }
    return "搜索内容...";
  };

  const handleAvatarClick = () => {
    if (!longtoken) {
      navigate("/login");
    } else {
      setIsUserMenuOpen(!isUserMenuOpen);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        MUNDO
      </div>
      <Menu />
      <div
        className={`${styles.searchWrapper} ${isFocused ? styles.focused : ""}`}
      >
        <IoSearchOutline className={styles.searchIcon} />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchText}
          onChange={onSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyPress={handleKeyPress}
          className={styles.searchInput}
        />
        <button className={styles.searchButton} onClick={onSearch}>
          搜索
        </button>
      </div>
      <div className={styles.userActions}>
        {!longtoken ? (
          <>
            <button
              className={styles.authButton}
              onClick={() => navigate("/login")}
            >
              登录
            </button>
            <button
              className={`${styles.authButton} ${styles.registerButton}`}
              onClick={() => navigate("/register")}
            >
              注册
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              {" "}
              <div ref={menuRef} className={styles.userMenuContainer}>
                <div
                  className={styles.avatar}
                  onClick={() => navigate("/info")}
                >
                  <img
                    src={avatar || DEFAULT_AVATAR}
                    alt="头像"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <IconExport
                className="text-[20px] text-current"
                style={{ minWidth: "20px" }}
                onClick={() => {
                  setVisible(true);
                }}
              />
            </div>
          </>
        )}
        <Modal
          title={
            // <div className="flex items-center justify-center w-full ">
            //   <div className="text-[18px] font-medium text-black ml-[20px]">
            //     确定要退出登录吗？
            //   </div>
            // </div>
            null
          }
          mask={true}
          maskClosable={true}
          maskStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "fixed",
            inset: 0,
            zIndex: 999,
            pointerEvents: "auto",
          }}
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false);
            localStorage.setItem("longtoken", "");
            navigate("/");
          }}
          closable={true}
          className=" w-auto max-w-[300px] z-[1000] rounded-lg"
          focusLock={true}
          footer={null}
        >
          <div className="flex flex-col w-full gap-[10px]">
            <div className="flex items-center justify-center w-full ">
              <div className="text-[18px] font-medium text-black ml-[20px]">
                确定要退出登录吗？
              </div>
            </div>
            <div className="flex items-center justify-center gap-[40px] w-full">
              <Button
                key="cancel"
                type="dashed"
                className="px-4 py-2 mr-3 text-sm font-medium bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-200"
                onClick={() => setVisible(false)}
              >
                取消
              </Button>
              <Button
                key="ok"
                type="primary"
                className="specialButton"
                // className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setVisible(false);
                  localStorage.setItem("longtoken", "");
                  navigate("/");
                }}
              >
                确定
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </header>
  );
};

export default Header;
