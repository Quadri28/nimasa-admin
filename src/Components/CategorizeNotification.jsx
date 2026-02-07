import { LuBell } from "react-icons/lu";

export const categorizeNotifications = (notifications) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  return {
    today: notifications.filter((notif) =>
      isSameDay(new Date(notif.createdOn), today)
    ),
    yesterday: notifications.filter((notif) =>
      isSameDay(new Date(notif.createdOn), yesterday)
    ),
    lastWeek: notifications.filter((notif) =>
      isWithinLastWeek(new Date(notif.createdOn), lastWeek, yesterday)
    ),
    older: notifications.filter(
      (notif) => new Date(notif.createdOn) < lastWeek
    ),
  };
};

const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

// Check if a date is within the last 7 days but not yesterday
const isWithinLastWeek = (date, lastWeek, yesterday) => {
  return date >= lastWeek && date < yesterday;
};

export const NotificationItem = ({ notif }) => (
  <div className="d-flex justify-content-between flex-wrap align-items-center my-1">
    <div className="d-flex gap-2 align-items-center">
      <div
        style={{
          backgroundColor: "#3785FB",
          color: "#fff",
          borderRadius: "50%",
          height: "32px",
          width: "32px",
        }}
        className="d-flex justify-content-center align-items-center"
      >
        <LuBell />
      </div>
      <span style={{ fontSize: "14px" }}>{notif.message}</span>
    </div>
    <small style={{ fontSize: "14px" }}>
      {new Date(notif.createdOn).toLocaleString()}
    </small>
  </div>
);
