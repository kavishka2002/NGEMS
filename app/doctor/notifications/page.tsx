"use client";

import { useEffect, useState } from 'react';
import { notifications } from '@/lib/data';

export default function DoctorNotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);

  useEffect(() => {
    fetch('/api/doctor/notifications')
      .then((res) => res.json())
      .then((data) => setNotificationList(data.notifications))
      .catch(() => setNotificationList(notifications));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Doctor Portal</p>
        <h1 className="text-3xl font-semibold text-slate-950">Notifications</h1>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-200">
          {notificationList.map((notification) => (
            <div key={notification.id} className={`px-6 py-5 ${notification.unread ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{notification.description}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
