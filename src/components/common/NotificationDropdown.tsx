import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Clock, ExternalLink } from "lucide-react";
import apiClient from "@/services/api/apiClient";

export interface NotificationItem {
  id: string | number;
  title?: string;
  message: string;
  is_read?: number | boolean;
  created_at?: string;
  type?: string;
  link?: string;
}

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/notifications");
      if (res.data?.ok && Array.isArray(res.data.data)) {
        setNotifications(res.data.data);
      } else if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch {
      // silently ignore polling failure
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string | number, isRead?: number | boolean) => {
    if (isRead) return;
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.post("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-moss hover:text-moss-dark font-medium flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck size={13} /> Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 sidebar-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.is_read)}
                  className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                    !n.is_read ? "bg-indigo-50/30 hover:bg-indigo-50/60" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.is_read ? "bg-moss" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    {n.title && (
                      <h4 className="text-xs font-semibold text-slate-800 mb-0.5 truncate">
                        {n.title}
                      </h4>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed break-words">
                      {n.message}
                    </p>
                    {n.created_at && (
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                        <Clock size={10} />
                        {new Date(n.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
