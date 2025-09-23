"use client"
import { useToast } from "@/components/ui/toast-provider";
import { Bell, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";



const NotificationItem = ({ 
  id, title, message, time, isRead, type, onMarkRead, onDelete 
}) => {
  const getTypeColor = () => {
    switch (type) {
      case "booking": return "bg-primary/10 text-primary";
      case "payment": return "bg-success/10 text-success";
      case "trip": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-colors ${
      isRead ? "bg-card border-border" : "bg-primary-light/20 border-primary/20"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
          isRead ? "bg-muted" : "bg-primary"
        }`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium-weight text-foreground text-sm">
              {title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor()}`}>
              {type}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
            {message}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{time}</span>
            <div className="flex gap-2">
              {!isRead && (
                <button
                  onClick={() => onMarkRead(id)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Mark as read"
                >
                  <Check className="w-4 h-4 text-success" />
                </button>
              )}
              <button
                onClick={() => onDelete(id)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Delete notification"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const navigate = useRouter();
  const { addToast } = useToast();

  const notifications = [
    {
      id: "1",
      title: "Booking Confirmed",
      message: "Your booking for Cozy Mountain Cabin has been confirmed for Dec 15-18.",
      time: "2 hours ago",
      isRead: false,
      type: "booking" 
    },
    {
      id: "2",
      title: "Payment Successful",
      message: "Payment of $540 for your upcoming trip has been processed successfully.",
      time: "1 day ago",
      isRead: false,
      type: "payment" 
    },
    {
      id: "3",
      title: "Trip Reminder",
      message: "Don't forget! Your trip to Malibu starts in 3 days. Check your itinerary.",
      time: "2 days ago",
      isRead: true,
      type: "trip"
    },
    {
      id: "4",
      title: "App Update",
      message: "New features available! Update to the latest version for the best experience.",
      time: "1 week ago",
      isRead: true,
      type: "system"
    }
  ];

  const handleBackClick = () => {
    navigate.push("/");
  };

  const handleMarkRead = (id) => {
    addToast({
      title: "Marked as read",
      description: "Notification has been marked as read",
    });
  };

  const handleDeleteNotification = (id) => {
    addToast({
      title: "Notification deleted",
      description: "Notification has been removed",
    });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-3 mx-auto bg-background min-h-screen">
        {/* <Header 
          title="Notifications" 
          onBackClick={handleBackClick}
        /> */}
        
        <div className="px-mobile py-section-gap">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading-weight text-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </h2>
            {notifications.length > 0 && (
              <button className="text-sm text-accent hover:text-accent/80 transition-colors">
                Mark all read
              </button>
            )}
          </div>
          
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  {...notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading-weight text-foreground mb-2">
                No notifications
              </h2>
              <p className="text-muted-foreground">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;