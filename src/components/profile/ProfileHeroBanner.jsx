import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Camera,
  Clock3,
  Edit3,
  Flame,
  MapPin,
  Pencil,
  Settings,
  Shield,
  Trash2,
  Zap,
} from "lucide-react";

import ImageCropperModal from "@/components/ui/ImageCropperModal";

const EASE = [0.16, 1, 0.3, 1];

const DEFAULT_COVER = "/assets/profile-cover-default.svg";

const ProfileHeroBanner = forwardRef(function ProfileHeroBanner(
  { profile, settingsPath = "/student/settings", showStreak = true, showEditProfile = true },
  ref
) {
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const editMenuRef = useRef(null);

  const [coverImage, setCoverImage] = useState(profile.cover ?? DEFAULT_COVER);
  const [avatarImage, setAvatarImage] = useState(profile.avatar);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [cropperMode, setCropperMode] = useState("avatar");
  const [editMenuOpen, setEditMenuOpen] = useState(false);

  useEffect(() => {
    setAvatarImage(profile.avatar || null);
  }, [profile.avatar]);

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
  const hasAvatar = Boolean(avatarImage);

  useEffect(() => {
    if (!editMenuOpen) return;

    const handleClickOutside = (event) => {
      if (editMenuRef.current && !editMenuRef.current.contains(event.target)) {
        setEditMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editMenuOpen]);

  const readFile = (file, callback) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  const openCropper = (dataUrl, mode) => {
    setCropperMode(mode);
    setCropperSrc(dataUrl);
    setCropperOpen(true);
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    readFile(file, (dataUrl) => openCropper(dataUrl, "cover"));
    e.target.value = "";
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    readFile(file, (dataUrl) => openCropper(dataUrl, "avatar"));
    e.target.value = "";
  };

  const handleCropComplete = (dataUrl) => {
    if (cropperMode === "cover") setCoverImage(dataUrl);
    else setAvatarImage(dataUrl);
  };

  const openAvatarPicker = () => {
    setEditMenuOpen(false);
    avatarInputRef.current?.click();
  };

  const openAvatarRecrop = () => {
    if (!avatarImage) {
      openAvatarPicker();
      return;
    }
    setEditMenuOpen(false);
    openCropper(avatarImage, "avatar");
  };

  const removeAvatar = () => {
    setAvatarImage(null);
    setEditMenuOpen(false);
  };

  useImperativeHandle(ref, () => ({
    openAvatarUpload: openAvatarPicker,
    openAvatarEdit: () => setEditMenuOpen(true),
  }));

  return (
    <>
      <motion.section
        className="profile-hero profile-hero-linkedin"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {/* Cover */}
        <div className="profile-cover">
          <motion.img
            key={coverImage}
            src={coverImage}
            alt=""
            className="profile-cover-img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <span className="profile-cover-tint" aria-hidden />

          <motion.button
            type="button"
            className="profile-cover-upload-btn"
            onClick={() => coverInputRef.current?.click()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Camera className="h-4 w-4" />
            <span>Change cover</span>
          </motion.button>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleCoverSelect}
            aria-label="Upload cover photo"
          />
        </div>

        {/* Body */}
        <div className="profile-hero-body-linkedin">
          {/* Row 1: avatar + actions */}
          <div className="profile-hero-top">
            <div className="profile-avatar-slot">
              <motion.div
                className="profile-avatar-wrap"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                {hasAvatar ? (
                  <img src={avatarImage} alt={fullName} className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder" aria-label={`${fullName} avatar placeholder`}>
                    <span>{initials}</span>
                  </div>
                )}

                <div className="profile-avatar-actions">
                  <div className="profile-avatar-edit-wrap" ref={editMenuRef}>
                    <motion.button
                      type="button"
                      className="profile-avatar-action-btn profile-avatar-action-btn-edit"
                      aria-label="Edit profile photo"
                      aria-expanded={editMenuOpen}
                      onClick={() => setEditMenuOpen((open) => !open)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </motion.button>

                    <AnimatePresence>
                      {editMenuOpen && (
                        <motion.div
                          className="profile-avatar-edit-menu"
                          initial={{ opacity: 0, y: -6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: EASE }}
                          role="menu"
                        >
                          <button
                            type="button"
                            className="profile-avatar-edit-menu-item"
                            role="menuitem"
                            onClick={openAvatarPicker}
                          >
                            <Camera className="h-3.5 w-3.5" />
                            {hasAvatar ? "Change photo" : "Upload photo"}
                          </button>
                          {hasAvatar && (
                            <button
                              type="button"
                              className="profile-avatar-edit-menu-item"
                              role="menuitem"
                              onClick={openAvatarRecrop}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Adjust crop
                            </button>
                          )}
                          {hasAvatar && (
                            <button
                              type="button"
                              className="profile-avatar-edit-menu-item profile-avatar-edit-menu-item-danger"
                              role="menuitem"
                              onClick={removeAvatar}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove photo
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarSelect}
                aria-label="Upload profile photo"
              />
            </div>

            <div className="profile-hero-actions-linkedin">
              <Link
                to={settingsPath}
                className="profile-btn profile-btn-outline profile-btn-icon-only"
                aria-label="Account settings"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              {showEditProfile && (
                <button type="button" className="profile-btn profile-btn-primary">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: identity */}
          <motion.div
            className="profile-hero-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4, ease: EASE }}
          >
            {profile.headline ? (
              <p className="profile-hero-headline">{profile.headline}</p>
            ) : null}

            <div className="profile-hero-name-row">
              <h1 className="profile-hero-name">{fullName}</h1>
              <span className="profile-username">{profile.username}</span>
            </div>

            <div className="profile-hero-badges">
              {profile.verified && (
                <span className="dashboard-status-live">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              )}
              <span className="profile-plan-badge">
                <Zap className="h-3 w-3" />
                {profile.plan}
              </span>
              {showStreak && (
                <motion.span
                  className="dashboard-streak-badge"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  <Flame className="h-3.5 w-3.5" />
                  {profile.streak} day streak
                </motion.span>
              )}
            </div>

            {profile.bio ? (
              <p className="profile-hero-bio">{profile.bio}</p>
            ) : null}

            <div className="profile-hero-meta profile-hero-meta-linkedin">
              <span>
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {profile.location}
              </span>
              <span className="profile-meta-dot" aria-hidden>
                ·
              </span>
              <span>
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                {profile.memberSince}
              </span>
              <span className="profile-meta-dot hidden sm:inline" aria-hidden>
                ·
              </span>
              <span className="hidden sm:inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5 shrink-0" />
                Active {profile.lastActive}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <ImageCropperModal
        open={cropperOpen}
        imageSrc={cropperSrc}
        title={cropperMode === "avatar" ? "Crop profile photo" : "Crop cover photo"}
        shape={cropperMode === "avatar" ? "circle" : "rect"}
        aspect={4}
        onClose={() => {
          setCropperOpen(false);
          setCropperSrc(null);
        }}
        onComplete={handleCropComplete}
      />
    </>
  );
});

export default ProfileHeroBanner;
