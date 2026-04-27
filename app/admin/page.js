"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import styles from "./admin.module.css";
import { useToast } from "@/app/components/Toast";

export default function AdminDashboard() {
  const toast = useToast();
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");

  // Search and filter states
  const [userSearch, setUserSearch] = useState("");
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Notification states
  const [notifSubject, setNotifSubject] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifSending, setNotifSending] = useState(false);
  const [notifResult, setNotifResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/data", {
        headers: { "x-admin-key": adminKey },
      });
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setIsAuthenticated(true);
      } else {
        toast.error("Invalid admin key");
      }
    } catch (error) {
      toast.error("Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) return;
    const headers = Object.keys(dataArray[0]);
    const csvContent = [
      headers.join(","),
      ...dataArray.map((row) =>
        headers.map((h) => {
          const v = row[h];
          if (typeof v === "object" && v !== null) return JSON.stringify(v).replace(/,/g, ";");
          return `"${v || ""}"`;
        }).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setNotifSending(true);
    setNotifResult(null);
    try {
      const res = await fetch("/api/notify/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ subject: notifSubject, message: notifMessage }),
      });
      const data = await res.json();
      setNotifResult(data);
      if (data.success) {
        setNotifSubject("");
        setNotifMessage("");
      }
    } catch {
      setNotifResult({ success: false, message: "Network error" });
    } finally {
      setNotifSending(false);
    }
  };

  const filteredUsers = data?.users.filter((user) => {
    const s = userSearch.toLowerCase();
    return user.name.toLowerCase().includes(s) || user.email.toLowerCase().includes(s) || (user.phone && user.phone.includes(userSearch));
  });

  const filteredPurchases = data?.purchases.filter((purchase) => {
    const s = purchaseSearch.toLowerCase();
    const matchesSearch = purchase.user?.name?.toLowerCase().includes(s) || purchase.user?.email?.toLowerCase().includes(s) || purchase.planName.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    const matchesPlan = planFilter === "all" || purchase.planName === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const enhancedStats = data ? {
    ...data.stats,
    revenueByStatus: data.purchases.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + (p.price || 0); return acc; }, {}),
    completedRevenue: data.purchases.filter(p => p.status === "completed").reduce((sum, p) => sum + (p.price || 0), 0),
    pendingRevenue: data.purchases.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.price || 0), 0),
    recentUsers: data.users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    recentPurchases: data.purchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)).slice(0, 5),
  } : null;

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.mainContent}>
          <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
              <h1>Admin Dashboard</h1>
              <p>Enter admin key to access</p>
              <form onSubmit={handleLogin}>
                <input type="password" placeholder="Admin Key" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} required />
                <button type="submit" disabled={loading}>{loading ? "Authenticating..." : "Access Dashboard"}</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.dashboardHeader}>
            <h1>Admin Dashboard</h1>
            <button className={styles.logoutBtn} onClick={() => { setIsAuthenticated(false); setData(null); setAdminKey(""); }}>
              Logout
            </button>
          </div>

          <div className={styles.tabs}>
            {[
              { key: "stats", label: "📊 Statistics" },
              { key: "users", label: `👥 Users (${filteredUsers?.length || 0})` },
              { key: "purchases", label: `💰 Purchases (${filteredPurchases?.length || 0})` },
              { key: "notifications", label: "📢 Notifications" },
            ].map(({ key, label }) => (
              <button key={key} className={`${styles.tab} ${activeTab === key ? styles.activeTab : ""}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className={styles.tabContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}><h3>Total Users</h3><p className={styles.statValue}>{data?.stats.totalUsers}</p></div>
                <div className={styles.statCard}><h3>Total Purchases</h3><p className={styles.statValue}>{data?.stats.totalPurchases}</p></div>
                <div className={styles.statCard}><h3>Total Revenue</h3><p className={styles.statValue}>${data?.stats.totalRevenue.toLocaleString()}</p></div>
                <div className={styles.statCard}><h3>Completed Revenue</h3><p className={styles.statValue}>${enhancedStats?.completedRevenue.toLocaleString()}</p></div>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.purchaseBreakdown}>
                  <h2>Purchases by Plan</h2>
                  <div className={styles.planStats}>
                    {Object.entries(data?.stats.purchasesByPlan || {}).map(([plan, count]) => (
                      <div key={plan} className={styles.planStat}><span>{plan}</span><span className={styles.count}>{count}</span></div>
                    ))}
                  </div>
                </div>
                <div className={styles.purchaseBreakdown}>
                  <h2>Revenue by Status</h2>
                  <div className={styles.planStats}>
                    {Object.entries(enhancedStats?.revenueByStatus || {}).map(([status, revenue]) => (
                      <div key={status} className={styles.planStat}><span className={styles[status]}>{status}</span><span className={styles.count}>${revenue.toLocaleString()}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.recentActivity}>
                  <h2>Recent Users</h2>
                  <div className={styles.activityList}>
                    {enhancedStats?.recentUsers.map((user) => (
                      <div key={user.id} className={styles.activityItem}>
                        <div><strong>{user.name}</strong><br /><small>{user.email}</small>{!user.emailVerified && <span style={{ marginLeft: 8, color: "#e0c73a", fontSize: 12 }}>⚠ unverified</span>}</div>
                        <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.recentActivity}>
                  <h2>Recent Purchases</h2>
                  <div className={styles.activityList}>
                    {enhancedStats?.recentPurchases.map((purchase) => (
                      <div key={purchase.id} className={styles.activityItem}>
                        <div><strong>{purchase.planName}</strong><br /><small>{purchase.user?.name || "Unknown"}</small></div>
                        <div className={styles.activityRight}><strong>${purchase.price}</strong><br /><span className={`${styles.statusSmall} ${styles[purchase.status]}`}>{purchase.status}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className={styles.tabContent}>
              <div className={styles.tableControls}>
                <input type="text" placeholder="🔍 Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className={styles.searchInput} />
                <button onClick={() => exportToCSV(filteredUsers, "users")} className={styles.exportBtn}>📥 Export CSV</button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Verified</th><th>Phone</th><th>Registered</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.emailVerified ? "✅" : "⚠️ No"}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers?.length === 0 && <div className={styles.noResults}>No users found</div>}
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === "purchases" && (
            <div className={styles.tabContent}>
              <div className={styles.tableControls}>
                <input type="text" placeholder="🔍 Search purchases..." value={purchaseSearch} onChange={(e) => setPurchaseSearch(e.target.value)} className={styles.searchInput} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className={styles.filterSelect}>
                  <option value="all">All Plans</option>
                  <option value="BOOK">Book</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="DISCORD">Discord</option>
                  <option value="DIGITAL">Digital</option>
                  <option value="PHYSICAL">Physical</option>
                  <option value="BUNDLE">Bundle</option>
                </select>
                <button onClick={() => exportToCSV(filteredPurchases, "purchases")} className={styles.exportBtn}>📥 Export CSV</button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>ID</th><th>User</th><th>Plan</th><th>Price</th><th>Devices</th><th>Status</th><th>Stripe Session</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {filteredPurchases?.map((purchase) => (
                      <tr key={purchase.id}>
                        <td>#{purchase.id}</td>
                        <td>{purchase.user?.name || "Unknown"}</td>
                        <td><strong>{purchase.planName}</strong></td>
                        <td>{purchase.price} {purchase.currency}</td>
                        <td>{purchase.devices}</td>
                        <td><span className={`${styles.status} ${styles[purchase.status]}`}>{purchase.status}</span></td>
                        <td style={{ fontSize: 11, fontFamily: "monospace" }}>{purchase.stripeSessionId ? purchase.stripeSessionId.slice(0, 20) + "…" : "-"}</td>
                        <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredPurchases?.length === 0 && <div className={styles.noResults}>No purchases found</div>}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className={styles.tabContent}>
              <h2 style={{ color: "#e0c73a", marginBottom: "1.5rem" }}>📢 Send Book Update Notification</h2>
              <p style={{ color: "#aaa", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                Compose a notification email and send it to all subscribers at once.
              </p>
              <form onSubmit={handleSendNotification} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 600 }}>
                <div>
                  <label style={{ display: "block", color: "#aaa", marginBottom: 6, fontSize: 14 }}>Subject</label>
                  <input
                    type="text"
                    value={notifSubject}
                    onChange={(e) => setNotifSubject(e.target.value)}
                    placeholder="e.g. New Chapter: Advanced Portfolio Theory"
                    required
                    className={styles.searchInput}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#aaa", marginBottom: 6, fontSize: 14 }}>Message</label>
                  <textarea
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    placeholder="Write your update message here…"
                    required
                    rows={8}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      color: "#f0f0f0",
                      padding: "0.75rem",
                      fontSize: 14,
                      fontFamily: "inherit",
                      resize: "vertical",
                      lineHeight: 1.6,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={notifSending}
                  className={styles.exportBtn}
                  style={{ alignSelf: "flex-start", padding: "0.75rem 1.5rem", fontSize: 15 }}
                >
                  {notifSending ? "Sending…" : "📤 Send to All Subscribers"}
                </button>
              </form>

              {notifResult && (
                <div style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.5rem",
                  borderRadius: 10,
                  background: notifResult.success ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${notifResult.success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  color: "#f0f0f0",
                }}>
                  {notifResult.success
                    ? `✅ Sent to ${notifResult.sent} subscriber${notifResult.sent !== 1 ? "s" : ""}${notifResult.failed ? `, ${notifResult.failed} failed` : ""}.`
                    : `❌ ${notifResult.message}`}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}