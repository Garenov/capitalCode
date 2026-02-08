"use client";
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import styles from "./admin.module.css";

export default function AdminDashboard() {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/data", {
        headers: {
          "x-admin-key": adminKey,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setIsAuthenticated(true);
      } else {
        alert("Invalid admin key");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  // Export to CSV function
  const exportToCSV = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) return;

    const headers = Object.keys(dataArray[0]);
    const csvContent = [
      headers.join(","),
      ...dataArray.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle nested objects
            if (typeof value === "object" && value !== null) {
              return JSON.stringify(value).replace(/,/g, ";");
            }
            return `"${value || ""}"`;
          })
          .join(",")
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

  // Filter users
  const filteredUsers = data?.users.filter((user) => {
    const searchLower = userSearch.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(userSearch))
    );
  });

  // Filter purchases
  const filteredPurchases = data?.purchases.filter((purchase) => {
    const searchLower = purchaseSearch.toLowerCase();
    const matchesSearch =
      purchase.user?.name?.toLowerCase().includes(searchLower) ||
      purchase.user?.email?.toLowerCase().includes(searchLower) ||
      purchase.planName.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    const matchesPlan = planFilter === "all" || purchase.planName === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Calculate enhanced statistics
  const enhancedStats = data ? {
    ...data.stats,
    revenueByStatus: data.purchases.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + (p.price || 0);
      return acc;
    }, {}),
    completedRevenue: data.purchases
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + (p.price || 0), 0),
    pendingRevenue: data.purchases
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + (p.price || 0), 0),
    recentUsers: data.users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    recentPurchases: data.purchases
      .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
      .slice(0, 5),
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
                <input
                  type="password"
                  placeholder="Admin Key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Authenticating..." : "Access Dashboard"}
                </button>
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
            <button
              className={styles.logoutBtn}
              onClick={() => {
                setIsAuthenticated(false);
                setData(null);
                setAdminKey("");
              }}
            >
              Logout
            </button>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "stats" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("stats")}
            >
              📊 Statistics
            </button>
            <button
              className={`${styles.tab} ${activeTab === "users" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("users")}
            >
              👥 Users ({filteredUsers?.length || 0})
            </button>
            <button
              className={`${styles.tab} ${activeTab === "purchases" ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab("purchases")}
            >
              💰 Purchases ({filteredPurchases?.length || 0})
            </button>
          </div>

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className={styles.tabContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h3>Total Users</h3>
                  <p className={styles.statValue}>{data?.stats.totalUsers}</p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Purchases</h3>
                  <p className={styles.statValue}>
                    {data?.stats.totalPurchases}
                  </p>
                </div>
                <div className={styles.statCard}>
                  <h3>Total Revenue</h3>
                  <p className={styles.statValue}>
                    {data?.stats.totalRevenue.toLocaleString()} Kč
                  </p>
                </div>
                <div className={styles.statCard}>
                  <h3>Completed Revenue</h3>
                  <p className={styles.statValue}>
                    {enhancedStats?.completedRevenue.toLocaleString()} Kč
                  </p>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.purchaseBreakdown}>
                  <h2>Purchases by Plan</h2>
                  <div className={styles.planStats}>
                    {Object.entries(data?.stats.purchasesByPlan || {}).map(
                      ([plan, count]) => (
                        <div key={plan} className={styles.planStat}>
                          <span>{plan}</span>
                          <span className={styles.count}>{count}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className={styles.purchaseBreakdown}>
                  <h2>Revenue by Status</h2>
                  <div className={styles.planStats}>
                    {Object.entries(enhancedStats?.revenueByStatus || {}).map(
                      ([status, revenue]) => (
                        <div key={status} className={styles.planStat}>
                          <span className={styles[status]}>{status}</span>
                          <span className={styles.count}>{revenue.toLocaleString()} Kč</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.recentActivity}>
                  <h2>Recent Users</h2>
                  <div className={styles.activityList}>
                    {enhancedStats?.recentUsers.map((user) => (
                      <div key={user.id} className={styles.activityItem}>
                        <div>
                          <strong>{user.name}</strong>
                          <br />
                          <small>{user.email}</small>
                        </div>
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
                        <div>
                          <strong>{purchase.planName}</strong>
                          <br />
                          <small>{purchase.user?.name || "Unknown"}</small>
                        </div>
                        <div className={styles.activityRight}>
                          <strong>{purchase.price} Kč</strong>
                          <br />
                          <span className={`${styles.statusSmall} ${styles[purchase.status]}`}>
                            {purchase.status}
                          </span>
                        </div>
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
                <input
                  type="text"
                  placeholder="🔍 Search users by name, email, or phone..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  onClick={() => exportToCSV(filteredUsers, "users")}
                  className={styles.exportBtn}
                >
                  📥 Export CSV
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || "-"}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers?.length === 0 && (
                <div className={styles.noResults}>No users found</div>
              )}
            </div>
          )}

          {/* Purchases Tab */}
          {activeTab === "purchases" && (
            <div className={styles.tabContent}>
              <div className={styles.tableControls}>
                <input
                  type="text"
                  placeholder="🔍 Search purchases..."
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  className={styles.searchInput}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Plans</option>
                  <option value="ESSENTIAL">Essential</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="ULTIMATE">Ultimate</option>
                </select>
                <button
                  onClick={() => exportToCSV(filteredPurchases, "purchases")}
                  className={styles.exportBtn}
                >
                  📥 Export CSV
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Price</th>
                      <th>Devices</th>
                      <th>Years</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases?.map((purchase) => (
                      <tr key={purchase.id}>
                        <td>#{purchase.id}</td>
                        <td>{purchase.user?.name || "Unknown"}</td>
                        <td><strong>{purchase.planName}</strong></td>
                        <td>
                          {purchase.price} {purchase.currency}
                        </td>
                        <td>{purchase.devices}</td>
                        <td>{purchase.years}</td>
                        <td>
                          <span
                            className={`${styles.status} ${styles[purchase.status]}`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                        <td>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPurchases?.length === 0 && (
                <div className={styles.noResults}>No purchases found</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}