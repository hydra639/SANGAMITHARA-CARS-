/**
 * ==============================================================================
 * MITHARA TRAVEL AGENCY - ADMIN PORTAL APPLICATION ENGINE (SECOND WEBSITE)
 * ==============================================================================
 * Security & Features:
 * - Admin Authentication: Username "pream", Password "pream123"
 * - Persistent Session State Management (sessionStorage & localStorage)
 * - Registered Customers / Users Data Table with Full CRUD & CSV Export
 * - Cab Bookings Management with Status Pipeline & Supabase Sync
 * - Contact Inquiries Tracking Desk
 * - System Analytics & Complete Database Backup / Restore
 * ==============================================================================
 */

(function () {
  'use strict';

  // Master Authentication Credentials
  const AUTH_CREDENTIALS = {
    username: 'pream',
    password: 'pream123'
  };

  const SESSION_STORAGE_KEY = 'mta_admin_auth_session';
  const LOCAL_STORAGE_REMEMBER_KEY = 'mta_admin_remember_token';

  // Application State
  let currentTab = 'registrations'; // default to register data
  let activeEditUserId = null;

  // DOM Elements cache
  const DOM = {};

  function initDOMElements() {
    DOM.loginView = document.getElementById('loginView');
    DOM.adminView = document.getElementById('adminView');
    DOM.loginForm = document.getElementById('loginForm');
    DOM.usernameInput = document.getElementById('loginUsername');
    DOM.passwordInput = document.getElementById('loginPassword');
    DOM.rememberMeCheckbox = document.getElementById('rememberMe');
    DOM.loginAlert = document.getElementById('loginAlert');
    DOM.loginAlertText = document.getElementById('loginAlertText');
    DOM.togglePasswordBtn = document.getElementById('togglePasswordBtn');

    DOM.btnLogout = document.getElementById('btnLogout');
    DOM.btnRefreshCloud = document.getElementById('btnRefreshCloud');
    DOM.syncStatus = document.getElementById('syncStatus');
    DOM.syncStatusText = document.getElementById('syncStatusText');

    // Stats Counters
    DOM.statTotalUsers = document.getElementById('statTotalUsers');
    DOM.statTotalBookings = document.getElementById('statTotalBookings');
    DOM.statPendingBookings = document.getElementById('statPendingBookings');
    DOM.statTotalRevenue = document.getElementById('statTotalRevenue');
    DOM.statTotalInquiries = document.getElementById('statTotalInquiries');

    // Tab buttons & badges
    DOM.tabButtons = document.querySelectorAll('.tab-btn');
    DOM.tabPanels = document.querySelectorAll('.tab-panel');
    DOM.badgeUsersCount = document.getElementById('badgeUsersCount');
    DOM.badgeBookingsCount = document.getElementById('badgeBookingsCount');
    DOM.badgeInquiriesCount = document.getElementById('badgeInquiriesCount');

    // Registrations Tab DOM
    DOM.regSearchInput = document.getElementById('regSearchInput');
    DOM.regStatusFilter = document.getElementById('regStatusFilter');
    DOM.registrationsTableBody = document.getElementById('registrationsTableBody');
    DOM.btnOpenAddUserModal = document.getElementById('btnOpenAddUserModal');
    DOM.btnExportUsersCSV = document.getElementById('btnExportUsersCSV');

    // Bookings Tab DOM
    DOM.bookingSearchInput = document.getElementById('bookingSearchInput');
    DOM.bookingStatusFilter = document.getElementById('bookingStatusFilter');
    DOM.bookingsTableBody = document.getElementById('bookingsTableBody');
    DOM.btnExportBookingsCSV = document.getElementById('btnExportBookingsCSV');

    // Inquiries Tab DOM
    DOM.inquirySearchInput = document.getElementById('inquirySearchInput');
    DOM.inquiryStatusFilter = document.getElementById('inquiryStatusFilter');
    DOM.inquiriesTableBody = document.getElementById('inquiriesTableBody');

    // Modals
    DOM.userModal = document.getElementById('userModal');
    DOM.userModalTitle = document.getElementById('userModalTitle');
    DOM.userForm = document.getElementById('userForm');
    DOM.userModalClose = document.getElementById('userModalClose');
    DOM.userModalCancel = document.getElementById('userModalCancel');

    DOM.toastContainer = document.getElementById('toastContainer');
  }

  // ==========================================================================
  // AUTHENTICATION & SESSION HANDLING
  // ==========================================================================

  function isAuthenticated() {
    const sessionToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (sessionToken === 'authenticated_pream') return true;

    const rememberToken = localStorage.getItem(LOCAL_STORAGE_REMEMBER_KEY);
    if (rememberToken === 'authenticated_pream') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'authenticated_pream');
      return true;
    }
    return false;
  }

  function handleLogin(e) {
    e.preventDefault();
    const user = (DOM.usernameInput.value || '').trim();
    const pass = (DOM.passwordInput.value || '').trim();

    if (!user || !pass) {
      showLoginAlert('Please enter both username and password.');
      return;
    }

    if (user === AUTH_CREDENTIALS.username && pass === AUTH_CREDENTIALS.password) {
      // Successful authentication
      hideLoginAlert();
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'authenticated_pream');
      if (DOM.rememberMeCheckbox && DOM.rememberMeCheckbox.checked) {
        localStorage.setItem(LOCAL_STORAGE_REMEMBER_KEY, 'authenticated_pream');
      }

      showToast('Welcome, Administrator Pream! Login successful.', 'success');
      showAdminDashboard();
    } else {
      showLoginAlert('Invalid username or password. Please check your credentials.');
      DOM.passwordInput.value = '';
      DOM.passwordInput.focus();
    }
  }

  function handleLogout() {
    if (confirm('Are you sure you want to log out of Mithara Admin Portal?')) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_REMEMBER_KEY);
      showLoginView();
      showToast('You have been securely logged out.', 'success');
    }
  }

  function showLoginView() {
    DOM.loginView.style.display = 'flex';
    DOM.adminView.style.display = 'none';
    if (DOM.usernameInput) DOM.usernameInput.value = '';
    if (DOM.passwordInput) DOM.passwordInput.value = '';
  }

  function showAdminDashboard() {
    DOM.loginView.style.display = 'none';
    DOM.adminView.style.display = 'block';
    refreshAllData();
  }

  function showLoginAlert(message) {
    if (DOM.loginAlert && DOM.loginAlertText) {
      DOM.loginAlertText.textContent = message;
      DOM.loginAlert.style.display = 'flex';
    }
  }

  function hideLoginAlert() {
    if (DOM.loginAlert) {
      DOM.loginAlert.style.display = 'none';
    }
  }

  function togglePasswordVisibility() {
    if (!DOM.passwordInput) return;
    const isPassword = DOM.passwordInput.type === 'password';
    DOM.passwordInput.type = isPassword ? 'text' : 'password';
    DOM.togglePasswordBtn.textContent = isPassword ? '🙈' : '👁️';
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================

  function showToast(message, type = 'success') {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : '⚠️'}</span>
      <span>${escapeHtml(message)}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // TAB NAVIGATION
  // ==========================================================================

  function switchTab(targetTab) {
    currentTab = targetTab;
    DOM.tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    DOM.tabPanels.forEach(panel => {
      if (panel.id === `tab-${targetTab}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // DATA RENDERING & MANAGEMENT
  // ==========================================================================

  function refreshAllData() {
    renderStats();
    renderRegistrations();
    renderBookings();
    renderInquiries();
  }

  function renderStats() {
    if (!window.AdminDB) return;
    const stats = window.AdminDB.getStats();

    if (DOM.statTotalUsers) DOM.statTotalUsers.textContent = stats.totalRegistrations || 0;
    if (DOM.statTotalBookings) DOM.statTotalBookings.textContent = stats.totalBookings || 0;
    if (DOM.statPendingBookings) DOM.statPendingBookings.textContent = stats.pendingBookings || 0;
    if (DOM.statTotalRevenue) DOM.statTotalRevenue.textContent = '₹' + (stats.totalRevenue || 0).toLocaleString('en-IN');
    if (DOM.statTotalInquiries) DOM.statTotalInquiries.textContent = stats.totalInquiries || 0;

    if (DOM.badgeUsersCount) DOM.badgeUsersCount.textContent = stats.totalRegistrations || 0;
    if (DOM.badgeBookingsCount) DOM.badgeBookingsCount.textContent = stats.totalBookings || 0;
    if (DOM.badgeInquiriesCount) DOM.badgeInquiriesCount.textContent = stats.totalInquiries || 0;
  }

  // --------------------------------------------------------------------------
  // 1. REGISTER DATA / REGISTERED USERS MANAGEMENT
  // --------------------------------------------------------------------------

  function renderRegistrations() {
    if (!DOM.registrationsTableBody || !window.AdminDB) return;
    const registrations = window.AdminDB.getRegistrations();
    const query = (DOM.regSearchInput ? DOM.regSearchInput.value : '').trim().toLowerCase();
    const statusFilter = (DOM.regStatusFilter ? DOM.regStatusFilter.value : 'all').toLowerCase();

    const filtered = registrations.filter(user => {
      const matchSearch = !query ||
        (user.name && user.name.toLowerCase().includes(query)) ||
        (user.phone && user.phone.includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.city && user.city.toLowerCase().includes(query)) ||
        (user.id && user.id.toLowerCase().includes(query));

      const matchStatus = statusFilter === 'all' || (user.status && user.status.toLowerCase() === statusFilter);

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      DOM.registrationsTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <div class="empty-state-title">No Registered Users Found</div>
              <p>Click "Register New Customer" to add a customer record or adjust your search filter.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    DOM.registrationsTableBody.innerHTML = filtered.map(user => {
      const cleanPhone = (user.phone || '').replace(/\D/g, '');
      const statusClass = (user.status || 'Active').toLowerCase() === 'active' ? 'badge-active' : 'badge-cancelled';
      const badgeVip = (user.memberType || '').includes('Premium') || (user.memberType || '').includes('VIP') ? 'badge-vip' : 'badge-standard';

      return `
        <tr>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-gold); font-size: 0.8rem;">
              ${escapeHtml(user.id || 'REG')}
            </div>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${escapeHtml(user.name || 'Unnamed')}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${escapeHtml(user.notes || 'Customer')}</div>
          </td>
          <td>
            <div style="font-weight: 600;">${escapeHtml(user.phone || 'N/A')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(user.email || '—')}</div>
          </td>
          <td>${escapeHtml(user.city || 'Salem, Tamil Nadu')}</td>
          <td>
            <span class="badge ${badgeVip}">${escapeHtml(user.memberType || 'Standard')}</span>
          </td>
          <td>
            <span class="badge ${statusClass}">${escapeHtml(user.status || 'Active')}</span>
          </td>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono); color: #fff;">${user.totalRides || 0} rides</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${new Date(user.registeredAt).toLocaleDateString('en-IN')}</div>
          </td>
          <td>
            <div class="table-actions">
              <a href="tel:${cleanPhone}" class="btn-table-action" title="Call Customer">📞 Call</a>
              <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(user.name || 'Customer')}%2C%20greetings%20from%20Mithara%20Travel%20Agency%20Salem!" target="_blank" rel="noopener" class="btn-table-action whatsapp" title="Chat on WhatsApp">💬 WA</a>
              <button class="btn-table-action" onclick="window.AdminApp.openEditUser('${user.id}')" title="Edit Customer">✏️ Edit</button>
              <button class="btn-table-action delete" onclick="window.AdminApp.deleteUser('${user.id}')" title="Delete Record">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function openAddUserModal() {
    activeEditUserId = null;
    DOM.userModalTitle.textContent = 'Register New Customer / User';
    DOM.userForm.reset();
    document.getElementById('userRegId').value = '';
    document.getElementById('userStatus').value = 'Active';
    document.getElementById('userMemberType').value = 'Standard Member';
    DOM.userModal.classList.add('open');
  }

  function openEditUserModal(id) {
    const user = window.AdminDB.getRegistrationById(id);
    if (!user) return;

    activeEditUserId = id;
    DOM.userModalTitle.textContent = `Edit Customer Record (${user.id})`;
    document.getElementById('userRegId').value = user.id;
    document.getElementById('userName').value = user.name || '';
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userEmail').value = user.email || '';
    document.getElementById('userCity').value = user.city || '';
    document.getElementById('userMemberType').value = user.memberType || 'Standard Member';
    document.getElementById('userStatus').value = user.status || 'Active';
    document.getElementById('userTotalRides').value = user.totalRides || 0;
    document.getElementById('userNotes').value = user.notes || '';

    DOM.userModal.classList.add('open');
  }

  function closeUserModal() {
    DOM.userModal.classList.remove('open');
    DOM.userForm.reset();
    activeEditUserId = null;
  }

  function handleUserFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const city = document.getElementById('userCity').value.trim();
    const memberType = document.getElementById('userMemberType').value;
    const status = document.getElementById('userStatus').value;
    const totalRides = Number(document.getElementById('userTotalRides').value) || 0;
    const notes = document.getElementById('userNotes').value.trim();

    if (!name || !phone) {
      alert('Please fill in both Name and Phone number.');
      return;
    }

    if (activeEditUserId) {
      // Update existing
      window.AdminDB.updateRegistration(activeEditUserId, {
        name,
        phone,
        email,
        city,
        memberType,
        status,
        totalRides,
        notes
      });
      showToast(`Updated customer record for ${name}.`, 'success');
    } else {
      // Create new
      window.AdminDB.saveRegistration({
        name,
        phone,
        email,
        city,
        memberType,
        status,
        totalRides,
        notes
      });
      showToast(`Successfully registered customer ${name}!`, 'success');
    }

    closeUserModal();
    refreshAllData();
  }

  function deleteUserRecord(id) {
    const user = window.AdminDB.getRegistrationById(id);
    const name = user ? user.name : 'this user';
    if (confirm(`Are you sure you want to delete registration record for "${name}" (${id})?`)) {
      window.AdminDB.deleteRegistration(id);
      showToast(`Deleted registration record ${id}.`, 'success');
      refreshAllData();
    }
  }

  // --------------------------------------------------------------------------
  // 2. CAB BOOKINGS MANAGEMENT
  // --------------------------------------------------------------------------

  function renderBookings() {
    if (!DOM.bookingsTableBody || !window.AdminDB) return;
    const bookings = window.AdminDB.getBookings();
    const query = (DOM.bookingSearchInput ? DOM.bookingSearchInput.value : '').trim().toLowerCase();
    const statusFilter = (DOM.bookingStatusFilter ? DOM.bookingStatusFilter.value : 'all').toLowerCase();

    const filtered = bookings.filter(b => {
      const matchSearch = !query ||
        (b.customerName && b.customerName.toLowerCase().includes(query)) ||
        (b.customerMobile && b.customerMobile.includes(query)) ||
        (b.bookingCode && b.bookingCode.toLowerCase().includes(query)) ||
        (b.pickup && b.pickup.toLowerCase().includes(query)) ||
        (b.destination && b.destination.toLowerCase().includes(query));

      const matchStatus = statusFilter === 'all' || (b.status && b.status.toLowerCase() === statusFilter);

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      DOM.bookingsTableBody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state">
              <div class="empty-state-icon">🚕</div>
              <div class="empty-state-title">No Bookings Found</div>
              <p>No trip bookings match your current filter criteria.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    DOM.bookingsTableBody.innerHTML = filtered.map(b => {
      const cleanPhone = (b.customerMobile || '').replace(/\D/g, '');
      let statusBadgeClass = 'badge-pending';
      const st = (b.status || 'Pending').toLowerCase();
      if (st === 'confirmed') statusBadgeClass = 'badge-confirmed';
      else if (st === 'completed') statusBadgeClass = 'badge-completed';
      else if (st === 'cancelled') statusBadgeClass = 'badge-cancelled';

      return `
        <tr>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-gold); font-size: 0.85rem;">
              ${escapeHtml(b.bookingCode || b.id.substring(0, 8))}
            </div>
            <div style="font-size: 0.725rem; color: var(--text-dim);">${new Date(b.createdAt).toLocaleDateString('en-IN')}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${escapeHtml(b.customerName || 'Customer')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(b.customerMobile || 'N/A')}</div>
          </td>
          <td>
            <div style="font-size: 0.825rem; color: #cbd5e1; max-width: 220px; line-height: 1.3;">
              <span style="color: #60a5fa; font-weight: 600;">📍 From:</span> ${escapeHtml(b.pickup || 'Salem Central')}<br>
              <span style="color: #34d399; font-weight: 600;">🏁 To:</span> ${escapeHtml(b.destination || 'Destination')}
            </div>
          </td>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono);">${b.distanceKm || 0} KM</div>
            <div style="font-size: 0.75rem; color: var(--text-dim);">@ ₹${b.ratePerKm || 80}/km</div>
          </td>
          <td>
            <div style="font-weight: 800; font-family: var(--font-mono); color: var(--text-gold); font-size: 1.05rem;">
              ₹${(b.estimatedFare || 0).toLocaleString('en-IN')}
            </div>
          </td>
          <td>
            <span class="badge ${statusBadgeClass}">${escapeHtml(b.status || 'Pending')}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              <select class="filter-select" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onchange="window.AdminApp.updateBookingStatus('${b.id}', this.value)">
                <option value="Pending" ${b.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Confirmed" ${b.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>
          </td>
          <td>
            <div class="table-actions">
              <a href="tel:${cleanPhone}" class="btn-table-action" title="Call Customer">📞</a>
              <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(b.customerName || 'Customer')}%2C%20regarding%20your%20cab%20booking%20${encodeURIComponent(b.bookingCode || '')}%20from%20${encodeURIComponent(b.pickup || '')}%20to%20${encodeURIComponent(b.destination || '')}%20with%20Mithara%20Travels." target="_blank" rel="noopener" class="btn-table-action whatsapp" title="Chat on WhatsApp">💬</a>
              <button class="btn-table-action delete" onclick="window.AdminApp.deleteBooking('${b.id}')" title="Delete Booking">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateBookingStatus(id, newStatus) {
    if (window.AdminDB.updateBookingStatus(id, newStatus)) {
      showToast(`Updated booking status to ${newStatus}.`, 'success');
      refreshAllData();
    }
  }

  function deleteBookingRecord(id) {
    if (confirm(`Are you sure you want to delete booking record (${id})?`)) {
      window.AdminDB.deleteBooking(id);
      showToast('Booking deleted successfully.', 'success');
      refreshAllData();
    }
  }

  // --------------------------------------------------------------------------
  // 3. INQUIRIES MANAGEMENT
  // --------------------------------------------------------------------------

  function renderInquiries() {
    if (!DOM.inquiriesTableBody || !window.AdminDB) return;
    const inquiries = window.AdminDB.getInquiries();
    const query = (DOM.inquirySearchInput ? DOM.inquirySearchInput.value : '').trim().toLowerCase();
    const statusFilter = (DOM.inquiryStatusFilter ? DOM.inquiryStatusFilter.value : 'all').toLowerCase();

    const filtered = inquiries.filter(inq => {
      const matchSearch = !query ||
        (inq.name && inq.name.toLowerCase().includes(query)) ||
        (inq.phone && inq.phone.includes(query)) ||
        (inq.route && inq.route.toLowerCase().includes(query)) ||
        (inq.message && inq.message.toLowerCase().includes(query));

      const matchStatus = statusFilter === 'all' || (inq.status && inq.status.toLowerCase() === statusFilter);

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      DOM.inquiriesTableBody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <div class="empty-state-icon">💬</div>
              <div class="empty-state-title">No Inquiries Found</div>
              <p>No customer travel inquiries match the current filter.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    DOM.inquiriesTableBody.innerHTML = filtered.map(inq => {
      const cleanPhone = (inq.phone || '').replace(/\D/g, '');
      const st = (inq.status || 'New').toLowerCase();
      let badgeClass = 'badge-new';
      if (st === 'contacted') badgeClass = 'badge-confirmed';
      else if (st === 'converted') badgeClass = 'badge-completed';
      else if (st === 'closed') badgeClass = 'badge-cancelled';

      return `
        <tr>
          <td>
            <div style="font-weight: 700; font-family: var(--font-mono); color: var(--text-gold); font-size: 0.85rem;">
              ${escapeHtml(inq.id || 'INQ')}
            </div>
            <div style="font-size: 0.725rem; color: var(--text-dim);">${new Date(inq.createdAt).toLocaleDateString('en-IN')}</div>
          </td>
          <td>
            <div style="font-weight: 700; color: #fff;">${escapeHtml(inq.name || 'Customer')}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(inq.phone || 'N/A')}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: #cbd5e1;">${escapeHtml(inq.route || 'General Travel Inquiry')}</div>
          </td>
          <td>
            <div style="font-size: 0.825rem; color: var(--text-muted); max-width: 280px; line-height: 1.4;">
              ${escapeHtml(inq.message || '—')}
            </div>
          </td>
          <td>
            <span class="badge ${badgeClass}">${escapeHtml(inq.status || 'New')}</span>
          </td>
          <td>
            <select class="filter-select" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onchange="window.AdminApp.updateInquiryStatus('${inq.id}', this.value)">
              <option value="New" ${inq.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Contacted" ${inq.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Converted" ${inq.status === 'Converted' ? 'selected' : ''}>Converted</option>
              <option value="Closed" ${inq.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <a href="tel:${cleanPhone}" class="btn-table-action" title="Call Customer">📞</a>
              <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(inq.name || 'Customer')}%2C%20thank%20you%20for%20contacting%20Mithara%20Travel%20Agency%20regarding%20your%20inquiry%20(${encodeURIComponent(inq.route || 'Tour Package')})." target="_blank" rel="noopener" class="btn-table-action whatsapp" title="Reply via WhatsApp">💬</a>
              <button class="btn-table-action delete" onclick="window.AdminApp.deleteInquiry('${inq.id}')" title="Delete Inquiry">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function updateInquiryStatus(id, newStatus) {
    if (window.AdminDB.updateInquiryStatus(id, newStatus)) {
      showToast(`Inquiry marked as ${newStatus}.`, 'success');
      refreshAllData();
    }
  }

  function deleteInquiryRecord(id) {
    if (confirm(`Delete inquiry record (${id})?`)) {
      window.AdminDB.deleteInquiry(id);
      showToast('Inquiry deleted.', 'success');
      refreshAllData();
    }
  }

  // --------------------------------------------------------------------------
  // 4. CLOUD SYNC & REFRESH
  // --------------------------------------------------------------------------

  async function triggerCloudSync() {
    if (!window.AdminDB) return;
    if (DOM.btnRefreshCloud) {
      DOM.btnRefreshCloud.innerHTML = '🔄 Syncing...';
      DOM.btnRefreshCloud.disabled = true;
    }

    try {
      const result = await window.AdminDB.syncWithSupabase();
      if (result) {
        showToast('Supabase Cloud database synced successfully!', 'success');
      } else {
        showToast('Cloud sync complete (Offline cache maintained).', 'success');
      }
    } catch (e) {
      showToast('Cloud sync notice: working in offline fallback mode.', 'error');
    } finally {
      if (DOM.btnRefreshCloud) {
        DOM.btnRefreshCloud.innerHTML = '🔄 Sync Supabase Cloud';
        DOM.btnRefreshCloud.disabled = false;
      }
      refreshAllData();
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & BOOTSTRAP
  // ==========================================================================

  function bindEvents() {
    // Login form submission
    if (DOM.loginForm) {
      DOM.loginForm.addEventListener('submit', handleLogin);
    }

    // Toggle password view
    if (DOM.togglePasswordBtn) {
      DOM.togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }

    // Logout
    if (DOM.btnLogout) {
      DOM.btnLogout.addEventListener('click', handleLogout);
    }

    // Cloud Sync
    if (DOM.btnRefreshCloud) {
      DOM.btnRefreshCloud.addEventListener('click', triggerCloudSync);
    }

    // Tab Navigation
    DOM.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Registrations Tab Events
    if (DOM.regSearchInput) DOM.regSearchInput.addEventListener('input', renderRegistrations);
    if (DOM.regStatusFilter) DOM.regStatusFilter.addEventListener('change', renderRegistrations);
    if (DOM.btnOpenAddUserModal) DOM.btnOpenAddUserModal.addEventListener('click', openAddUserModal);
    if (DOM.btnExportUsersCSV) DOM.btnExportUsersCSV.addEventListener('click', () => window.AdminDB.exportRegistrationsCSV());

    // Bookings Tab Events
    if (DOM.bookingSearchInput) DOM.bookingSearchInput.addEventListener('input', renderBookings);
    if (DOM.bookingStatusFilter) DOM.bookingStatusFilter.addEventListener('change', renderBookings);
    if (DOM.btnExportBookingsCSV) DOM.btnExportBookingsCSV.addEventListener('click', () => window.AdminDB.exportBookingsCSV());

    // Inquiries Tab Events
    if (DOM.inquirySearchInput) DOM.inquirySearchInput.addEventListener('input', renderInquiries);
    if (DOM.inquiryStatusFilter) DOM.inquiryStatusFilter.addEventListener('change', renderInquiries);

    // Modal Events
    if (DOM.userModalClose) DOM.userModalClose.addEventListener('click', closeUserModal);
    if (DOM.userModalCancel) DOM.userModalCancel.addEventListener('click', closeUserModal);
    if (DOM.userForm) DOM.userForm.addEventListener('submit', handleUserFormSubmit);

    // Close modal on click outside
    if (DOM.userModal) {
      DOM.userModal.addEventListener('click', (e) => {
        if (e.target === DOM.userModal) closeUserModal();
      });
    }

    // Database Custom Events
    window.addEventListener('admindb:registrationSaved', refreshAllData);
    window.addEventListener('admindb:registrationUpdated', refreshAllData);
    window.addEventListener('admindb:registrationDeleted', refreshAllData);
    window.addEventListener('admindb:bookingSaved', refreshAllData);
    window.addEventListener('admindb:bookingUpdated', refreshAllData);
    window.addEventListener('admindb:bookingDeleted', refreshAllData);
    window.addEventListener('admindb:inquirySaved', refreshAllData);
    window.addEventListener('admindb:inquiryUpdated', refreshAllData);
    window.addEventListener('admindb:inquiryDeleted', refreshAllData);
    window.addEventListener('admindb:synced', refreshAllData);
    window.addEventListener('admindb:cloudSynced', refreshAllData);
  }

  // Public Global API for Inline Table Handlers
  window.AdminApp = {
    openEditUser: openEditUserModal,
    deleteUser: deleteUserRecord,
    updateBookingStatus: updateBookingStatus,
    deleteBooking: deleteBookingRecord,
    updateInquiryStatus: updateInquiryStatus,
    deleteInquiry: deleteInquiryRecord,
    exportJSON: () => window.AdminDB.exportJSON(),
    clearDatabase: () => {
      if (confirm('CAUTION: Are you sure you want to clear ALL registered users, bookings, and inquiries from the database? This cannot be undone.')) {
        window.AdminDB.clearDatabase();
        showToast('Database wiped successfully.', 'error');
        refreshAllData();
      }
    }
  };

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    bindEvents();

    if (isAuthenticated()) {
      showAdminDashboard();
    } else {
      showLoginView();
    }
  });

})();
