/**
 * ==============================================================================
 * MITHARA TRAVEL AGENCY - DATABASE & STORAGE MANAGEMENT MODULE (CabDB / MitharaDB)
 * ==============================================================================
 * Connected to Supabase Cloud Database: https://ujchidcnanptczaouwlg.supabase.co
 * Provides persistent database operations for:
 * 1. Customer Cab Bookings (Pickup, Drop, Distance, Fare, Customer Details, Status)
 * 2. Contact Inquiries (Name, Phone, Route, Message, Status)
 * 3. Two-Way Supabase Synchronization (Live Cloud REST API)
 * 4. LocalStorage Fallback & Offline Resilience
 * 5. Export to CSV (Excel) & JSON Backup
 * ==============================================================================
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    BOOKINGS: 'mithara_bookings',
    INQUIRIES: 'mithara_inquiries',
    REGISTRATIONS: 'mithara_registrations',
    SETTINGS: 'mithara_settings',
    LEGACY_BOOKINGS: 'salemcab_bookings',
    LEGACY_INQUIRIES: 'salemcab_inquiries',
    LEGACY_SETTINGS: 'salemcab_settings'
  };

  const DEFAULT_SETTINGS = {
    agencyName: 'Mithara Travel Agency',
    contactNumber: '7904974485',
    contactNumberDisplay: '+91 79049 74485',
    ratePerKm: 80,
    supabaseUrl: 'https://ujchidcnanptczaouwlg.supabase.co',
    supabaseAnonKey: 'sb_publishable_YKrSzdCO-dUc7A74ZJYnSA_zgb_fAVm',
    googleMapsApiKey: ''
  };

  // Helper: UUID v4 Generator compatible with Supabase UUID type
  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Helper: Get item from localStorage with error handling
  function getStorageItem(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`[CabDB] Error reading key "${key}" from localStorage:`, e);
      return defaultValue;
    }
  }

  // Helper: Save item to localStorage with error handling
  function setStorageItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[CabDB] Error writing key "${key}" to localStorage:`, e);
      return false;
    }
  }

  // Helper: Get item from localStorage with fallback to legacy key
  function getStorageItemWithFallback(primaryKey, fallbackKey, defaultValue) {
    const primary = getStorageItem(primaryKey, null);
    if (primary !== null && primary !== undefined && Array.isArray(primary) && primary.length > 0) {
      return primary;
    }
    const legacy = getStorageItem(fallbackKey, null);
    if (legacy !== null && legacy !== undefined && Array.isArray(legacy) && legacy.length > 0) {
      setStorageItem(primaryKey, legacy);
      return legacy;
    }
    return primary || defaultValue;
  }

  // Seed initial sample data if local storage is completely empty
  function seedInitialDataIfEmpty() {
    const existingBookings = getStorageItemWithFallback(STORAGE_KEYS.BOOKINGS, STORAGE_KEYS.LEGACY_BOOKINGS, null);
    if (!existingBookings || existingBookings.length === 0) {
      const initialBookings = [
        {
          id: generateUUID(),
          bookingCode: 'MTA-TN-824102',
          customerName: 'Senthil Kumar',
          customerMobile: '7904974485',
          pickup: 'Salem Junction Railway Station, Salem',
          destination: 'Yercaud Lake & Town, Yercaud',
          distanceKm: 32,
          estimatedFare: 2560,
          ratePerKm: 80,
          status: 'Confirmed',
          notes: 'Family trip, AC Sedan',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
        },
        {
          id: generateUUID(),
          bookingCode: 'MTA-TN-719543',
          customerName: 'Priya Raman',
          customerMobile: '9842156789',
          pickup: 'Salem Central Bus Terminus (New Bus Stand), Salem',
          destination: 'Kempegowda International Airport (BLR), Devanahalli',
          distanceKm: 215,
          estimatedFare: 17200,
          ratePerKm: 80,
          status: 'Pending',
          notes: 'Flight departure at 8:00 PM',
          createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ];
      setStorageItem(STORAGE_KEYS.BOOKINGS, initialBookings);
    }

    const existingInquiries = getStorageItemWithFallback(STORAGE_KEYS.INQUIRIES, STORAGE_KEYS.LEGACY_INQUIRIES, null);
    if (!existingInquiries || existingInquiries.length === 0) {
      const initialInquiries = [
        {
          id: 'INQ-TN-39104',
          name: 'Venkatesh Babu',
          phone: '7904974485',
          route: 'Salem to Madurai & Rameswaram 3-Day Tour',
          message: 'Looking for 3-day Innova package for 5 adults with driver allowance details.',
          status: 'New',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
        }
      ];
      setStorageItem(STORAGE_KEYS.INQUIRIES, initialInquiries);
    }

    const existingRegistrations = getStorageItem(STORAGE_KEYS.REGISTRATIONS, null);
    if (!existingRegistrations || existingRegistrations.length === 0) {
      const initialRegistrations = [
        {
          id: 'REG-TN-1001',
          name: 'Pream Kumar',
          phone: '7904974485',
          email: 'pream@mitharatravels.com',
          city: 'Salem, Tamil Nadu',
          status: 'Active',
          memberType: 'Premium Member',
          totalRides: 14,
          notes: 'Regular traveler - Airport & Outstation routes',
          registeredAt: new Date(Date.now() - 86400000 * 15).toISOString()
        },
        {
          id: 'REG-TN-1002',
          name: 'Kavitha Rajan',
          phone: '9842156789',
          email: 'kavitha.rajan@gmail.com',
          city: 'Erode, Tamil Nadu',
          status: 'Active',
          memberType: 'Standard Member',
          totalRides: 5,
          notes: 'Corporate account bookings',
          registeredAt: new Date(Date.now() - 86400000 * 8).toISOString()
        },
        {
          id: 'REG-TN-1003',
          name: 'Murugan Karthik',
          phone: '9443218765',
          email: 'murugan.k@yahoo.com',
          city: 'Namakkal, Tamil Nadu',
          status: 'Active',
          memberType: 'Standard Member',
          totalRides: 2,
          notes: 'Kolli Hills tour regular',
          registeredAt: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
      setStorageItem(STORAGE_KEYS.REGISTRATIONS, initialRegistrations);
    }
  }

  // Execute seeding
  seedInitialDataIfEmpty();

  const CabDB = {
    // -------------------------------------------------------------------------
    // BOOKINGS CRUD OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Save a new cab booking into database (LocalStorage + Supabase Cloud)
     * @param {Object} booking
     * @returns {Object} Saved booking object
     */
    saveBooking: function (booking) {
      const bookings = this.getBookings();
      const uuid = (booking.id && booking.id.length > 20) ? booking.id : generateUUID();
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const code = booking.bookingCode || `MTA-TN-${randomNum}`;

      const newBooking = {
        id: uuid,
        bookingCode: code,
        customerName: (booking.customerName || booking.customer_name || '').trim(),
        customerMobile: (booking.customerMobile || booking.mobile_number || '').trim(),
        pickup: (booking.pickup || booking.pickup_location || 'Salem Central Hub').trim(),
        destination: (booking.destination || '').trim(),
        distanceKm: Number(booking.distanceKm || booking.distance_km) || 0,
        estimatedFare: Number(booking.estimatedFare || booking.estimated_fare) || 0,
        ratePerKm: Number(booking.ratePerKm || booking.rate_per_km) || 80,
        status: booking.status || booking.booking_status || 'Pending',
        notes: (booking.notes || '').trim(),
        createdAt: booking.createdAt || booking.created_at || new Date().toISOString()
      };

      // Prepend to local array (newest first)
      bookings.unshift(newBooking);
      setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);

      // Trigger custom browser event for live UI listeners
      try {
        window.dispatchEvent(new CustomEvent('cabdb:bookingSaved', { detail: newBooking }));
      } catch (e) {
        // Ignore if CustomEvent not supported
      }

      // Sync with Supabase Cloud
      this._syncToSupabase('bookings', newBooking);

      return newBooking;
    },

    /**
     * Retrieve all bookings from database
     * @returns {Array} List of bookings
     */
    getBookings: function () {
      return getStorageItemWithFallback(STORAGE_KEYS.BOOKINGS, STORAGE_KEYS.LEGACY_BOOKINGS, []);
    },

    /**
     * Get a single booking by ID or Booking Code
     * @param {string} id
     * @returns {Object|null}
     */
    getBookingById: function (id) {
      const bookings = this.getBookings();
      return bookings.find(b => b.id === id || b.bookingCode === id) || null;
    },

    /**
     * Update booking status
     * @param {string} id
     * @param {string} newStatus 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
     * @returns {boolean}
     */
    updateBookingStatus: function (id, newStatus) {
      const bookings = this.getBookings();
      const index = bookings.findIndex(b => b.id === id || b.bookingCode === id);
      if (index !== -1) {
        bookings[index].status = newStatus;
        bookings[index].updatedAt = new Date().toISOString();
        setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);
        window.dispatchEvent(new CustomEvent('cabdb:bookingUpdated', { detail: bookings[index] }));

        // Remote update to Supabase
        const targetId = bookings[index].id;
        const settings = this.getSettings();
        if (settings.supabaseUrl && settings.supabaseAnonKey && targetId) {
          fetch(`${settings.supabaseUrl}/rest/v1/bookings?id=eq.${targetId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': settings.supabaseAnonKey,
              'Authorization': `Bearer ${settings.supabaseAnonKey}`
            },
            body: JSON.stringify({ booking_status: newStatus })
          }).catch(err => console.warn('[CabDB] Supabase status update notice:', err));
        }

        return true;
      }
      return false;
    },

    /**
     * Delete a booking by ID
     * @param {string} id
     * @returns {boolean}
     */
    deleteBooking: function (id) {
      const bookings = this.getBookings();
      const matched = bookings.find(b => b.id === id || b.bookingCode === id);
      const filtered = bookings.filter(b => b.id !== id && b.bookingCode !== id);
      if (filtered.length !== bookings.length) {
        setStorageItem(STORAGE_KEYS.BOOKINGS, filtered);
        window.dispatchEvent(new CustomEvent('cabdb:bookingDeleted', { detail: { id } }));

        // Remote delete from Supabase
        const targetId = matched ? matched.id : id;
        const settings = this.getSettings();
        if (settings.supabaseUrl && settings.supabaseAnonKey && targetId) {
          fetch(`${settings.supabaseUrl}/rest/v1/bookings?id=eq.${targetId}`, {
            method: 'DELETE',
            headers: {
              'apikey': settings.supabaseAnonKey,
              'Authorization': `Bearer ${settings.supabaseAnonKey}`
            }
          }).catch(err => console.warn('[CabDB] Supabase delete notice:', err));
        }

        return true;
      }
      return false;
    },

    // -------------------------------------------------------------------------
    // INQUIRIES CRUD OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Save customer contact inquiry into the database
     * @param {Object} inquiry
     * @returns {Object} Saved inquiry object
     */
    saveInquiry: function (inquiry) {
      const inquiries = this.getInquiries();
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const newInquiry = {
        id: inquiry.id || `INQ-TN-${randomCode}`,
        name: (inquiry.name || '').trim(),
        phone: (inquiry.phone || '').trim(),
        route: (inquiry.route || '').trim(),
        message: (inquiry.message || '').trim(),
        status: inquiry.status || 'New',
        createdAt: inquiry.createdAt || new Date().toISOString()
      };

      inquiries.unshift(newInquiry);
      setStorageItem(STORAGE_KEYS.INQUIRIES, inquiries);

      try {
        window.dispatchEvent(new CustomEvent('cabdb:inquirySaved', { detail: newInquiry }));
      } catch (e) {
        // Ignore
      }

      this._syncToSupabase('inquiries', newInquiry);

      return newInquiry;
    },

    /**
     * Retrieve all inquiries
     * @returns {Array}
     */
    getInquiries: function () {
      return getStorageItemWithFallback(STORAGE_KEYS.INQUIRIES, STORAGE_KEYS.LEGACY_INQUIRIES, []);
    },

    /**
     * Update inquiry status
     * @param {string} id
     * @param {string} newStatus 'New' | 'Contacted' | 'Converted' | 'Closed'
     * @returns {boolean}
     */
    updateInquiryStatus: function (id, newStatus) {
      const inquiries = this.getInquiries();
      const index = inquiries.findIndex(item => item.id === id);
      if (index !== -1) {
        inquiries[index].status = newStatus;
        inquiries[index].updatedAt = new Date().toISOString();
        setStorageItem(STORAGE_KEYS.INQUIRIES, inquiries);
        window.dispatchEvent(new CustomEvent('cabdb:inquiryUpdated', { detail: inquiries[index] }));
        return true;
      }
      return false;
    },

    /**
     * Delete an inquiry by ID
     * @param {string} id
     * @returns {boolean}
     */
    deleteInquiry: function (id) {
      const inquiries = this.getInquiries();
      const filtered = inquiries.filter(item => item.id !== id);
      if (filtered.length !== inquiries.length) {
        setStorageItem(STORAGE_KEYS.INQUIRIES, filtered);
        window.dispatchEvent(new CustomEvent('cabdb:inquiryDeleted', { detail: { id } }));
        return true;
      }
      return false;
    },

    // -------------------------------------------------------------------------
    // REGISTRATIONS / REGISTER DATA CRUD OPERATIONS
    // -------------------------------------------------------------------------

    /**
     * Save or register a new customer/user in database
     * @param {Object} regData
     * @returns {Object}
     */
    saveRegistration: function (regData) {
      const registrations = this.getRegistrations();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const newRegistration = {
        id: regData.id || `REG-TN-${randomCode}`,
        name: (regData.name || '').trim(),
        phone: (regData.phone || '').trim(),
        email: (regData.email || '').trim(),
        city: (regData.city || 'Salem, Tamil Nadu').trim(),
        memberType: regData.memberType || 'Standard Member',
        status: regData.status || 'Active',
        totalRides: Number(regData.totalRides) || 0,
        notes: (regData.notes || '').trim(),
        registeredAt: regData.registeredAt || new Date().toISOString()
      };

      registrations.unshift(newRegistration);
      setStorageItem(STORAGE_KEYS.REGISTRATIONS, registrations);

      try {
        window.dispatchEvent(new CustomEvent('cabdb:registrationSaved', { detail: newRegistration }));
      } catch (e) {
        // Ignore
      }

      return newRegistration;
    },

    /**
     * Retrieve all registered users
     * @returns {Array}
     */
    getRegistrations: function () {
      return getStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
    },

    /**
     * Get registration by ID
     * @param {string} id
     * @returns {Object|null}
     */
    getRegistrationById: function (id) {
      const registrations = this.getRegistrations();
      return registrations.find(r => r.id === id || r.phone === id) || null;
    },

    /**
     * Update an existing registration
     * @param {string} id
     * @param {Object} updatedFields
     * @returns {boolean}
     */
    updateRegistration: function (id, updatedFields) {
      const registrations = this.getRegistrations();
      const index = registrations.findIndex(r => r.id === id);
      if (index !== -1) {
        registrations[index] = Object.assign({}, registrations[index], updatedFields, {
          updatedAt: new Date().toISOString()
        });
        setStorageItem(STORAGE_KEYS.REGISTRATIONS, registrations);
        window.dispatchEvent(new CustomEvent('cabdb:registrationUpdated', { detail: registrations[index] }));
        return true;
      }
      return false;
    },

    /**
     * Delete registration
     * @param {string} id
     * @returns {boolean}
     */
    deleteRegistration: function (id) {
      const registrations = this.getRegistrations();
      const filtered = registrations.filter(r => r.id !== id);
      if (filtered.length !== registrations.length) {
        setStorageItem(STORAGE_KEYS.REGISTRATIONS, filtered);
        window.dispatchEvent(new CustomEvent('cabdb:registrationDeleted', { detail: { id } }));
        return true;
      }
      return false;
    },

    // -------------------------------------------------------------------------
    // STATS & AGGREGATIONS
    // -------------------------------------------------------------------------

    getStats: function () {
      const bookings = this.getBookings();
      const inquiries = this.getInquiries();
      const registrations = this.getRegistrations();

      let totalFare = 0;
      let totalDistance = 0;
      let pendingCount = 0;
      let confirmedCount = 0;
      let completedCount = 0;

      bookings.forEach(b => {
        totalFare += (Number(b.estimatedFare) || 0);
        totalDistance += (Number(b.distanceKm) || 0);
        if (b.status === 'Pending') pendingCount++;
        if (b.status === 'Confirmed') confirmedCount++;
        if (b.status === 'Completed') completedCount++;
      });

      return {
        totalBookings: bookings.length,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        completedBookings: completedCount,
        totalDistanceKm: Math.round(totalDistance),
        totalRevenue: Math.round(totalFare),
        totalInquiries: inquiries.length,
        newInquiries: inquiries.filter(i => i.status === 'New').length,
        totalRegistrations: registrations.length,
        activeRegistrations: registrations.filter(r => r.status === 'Active').length
      };
    },

    // -------------------------------------------------------------------------
    // EXPORT & BACKUP
    // -------------------------------------------------------------------------

    /**
     * Export registered customers as CSV
     */
    exportRegistrationsCSV: function () {
      const registrations = this.getRegistrations();
      if (!registrations.length) {
        alert('No registered users available to export.');
        return;
      }

      const headers = ['Registration ID', 'Full Name', 'Phone Number', 'Email', 'City / Location', 'Membership', 'Status', 'Total Rides', 'Registered Date', 'Notes'];
      const rows = registrations.map(r => [
        `"${r.id || ''}"`,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${r.phone || ''}"`,
        `"${(r.email || '').replace(/"/g, '""')}"`,
        `"${(r.city || '').replace(/"/g, '""')}"`,
        `"${r.memberType || ''}"`,
        `"${r.status || ''}"`,
        r.totalRides || 0,
        `"${new Date(r.registeredAt).toLocaleDateString('en-IN')}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `mithara_registered_users_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    /**
     * Export all bookings as CSV spreadsheet (Excel compatible)
     */
    exportCSV: function () {
      const bookings = this.getBookings();
      if (!bookings.length) {
        alert('No bookings available in the database to export.');
        return;
      }

      const headers = ['Booking ID', 'Customer Name', 'Mobile Number', 'Pickup Location', 'Destination', 'Distance (KM)', 'Estimated Fare (INR)', 'Status', 'Booking Date', 'Notes'];
      const rows = bookings.map(b => [
        `"${b.bookingCode || b.id}"`,
        `"${(b.customerName || '').replace(/"/g, '""')}"`,
        `"${b.customerMobile || ''}"`,
        `"${(b.pickup || '').replace(/"/g, '""')}"`,
        `"${(b.destination || '').replace(/"/g, '""')}"`,
        b.distanceKm || 0,
        b.estimatedFare || 0,
        `"${b.status || ''}"`,
        `"${new Date(b.createdAt).toLocaleString('en-IN')}"`,
        `"${(b.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `mithara_travel_bookings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    /**
     * Export complete database backup as JSON file
     */
    exportJSON: function () {
      const backup = {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        supabaseDatabase: 'https://ujchidcnanptczaouwlg.supabase.co',
        registrations: this.getRegistrations(),
        bookings: this.getBookings(),
        inquiries: this.getInquiries(),
        settings: this.getSettings()
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `mithara_travel_database_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    },

    /**
     * Clear all records
     */
    clearDatabase: function () {
      setStorageItem(STORAGE_KEYS.BOOKINGS, []);
      setStorageItem(STORAGE_KEYS.INQUIRIES, []);
      setStorageItem(STORAGE_KEYS.REGISTRATIONS, []);
      window.dispatchEvent(new CustomEvent('cabdb:cleared'));
    },

    // -------------------------------------------------------------------------
    // SETTINGS
    // -------------------------------------------------------------------------

    getSettings: function () {
      const saved = getStorageItem(STORAGE_KEYS.SETTINGS, {});
      const settings = Object.assign({}, DEFAULT_SETTINGS, saved);
      // Ensure Supabase project is always actively set
      if (!settings.supabaseUrl) settings.supabaseUrl = DEFAULT_SETTINGS.supabaseUrl;
      if (!settings.supabaseAnonKey) settings.supabaseAnonKey = DEFAULT_SETTINGS.supabaseAnonKey;
      return settings;
    },

    saveSettings: function (newSettings) {
      const updated = Object.assign({}, this.getSettings(), newSettings);
      setStorageItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    },

    // -------------------------------------------------------------------------
    // SUPABASE CLOUD DATABASE CONNECTOR
    // -------------------------------------------------------------------------

    /**
     * Synchronize a new record with Supabase REST API
     * @param {string} table
     * @param {Object} payload
     */
    _syncToSupabase: function (table, payload) {
      const settings = this.getSettings();
      if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
        return;
      }

      let bodyData = payload;
      // Map to exact column names of Supabase 'bookings' table
      if (table === 'bookings') {
        bodyData = {
          customer_name: payload.customerName,
          mobile_number: payload.customerMobile,
          pickup_location: payload.pickup,
          destination: payload.destination,
          estimated_distance: Number(payload.distanceKm || 0),
          rate_per_km: Number(payload.ratePerKm || 80),
          estimated_fare: Number(payload.estimatedFare || 0),
          booking_status: payload.status || 'Pending',
          created_at: payload.createdAt || new Date().toISOString()
        };
      }

      fetch(`${settings.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': settings.supabaseAnonKey,
          'Authorization': `Bearer ${settings.supabaseAnonKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(bodyData)
      })
      .then(async res => {
        if (res.ok) {
          console.log(`[CabDB] Successfully saved row to Supabase ${table}:`, payload.id);
          window.dispatchEvent(new CustomEvent('cabdb:cloudSynced', { detail: { table, status: 'success', id: payload.id } }));
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn(`[CabDB] Supabase sync notice (${res.status}):`, errData);
          window.dispatchEvent(new CustomEvent('cabdb:cloudSyncError', { detail: { table, status: res.status, error: errData } }));
        }
      })
      .catch(err => {
        console.warn('[CabDB] Supabase network sync exception:', err);
      });
    },

    /**
     * Pull all latest bookings directly from Supabase Cloud Database and merge with local storage
     * @returns {Promise<Array|boolean>}
     */
    syncWithSupabase: async function () {
      const settings = this.getSettings();
      if (!settings.supabaseUrl || !settings.supabaseAnonKey) {
        return false;
      }

      try {
        const res = await fetch(`${settings.supabaseUrl}/rest/v1/bookings?select=*&order=created_at.desc`, {
          method: 'GET',
          headers: {
            'apikey': settings.supabaseAnonKey,
            'Authorization': `Bearer ${settings.supabaseAnonKey}`
          }
        });

        if (!res.ok) {
          console.warn('[CabDB] Supabase fetch returned HTTP', res.status);
          return false;
        }

        const remoteRows = await res.json();
        if (Array.isArray(remoteRows)) {
          console.log(`[CabDB] Supabase cloud sync: retrieved ${remoteRows.length} bookings.`);

          // Convert remote rows to unified frontend booking format
          const formattedRemote = remoteRows.map(row => {
            const rate = Number(row.rate_per_km || 80);
            const fare = Number(row.estimated_fare || 0);
            const dist = Number(row.estimated_distance) || (fare > 0 && rate > 0 ? Math.round(fare / rate) : 0);
            const shortCode = 'MTA-' + (row.id ? row.id.substring(0, 6).toUpperCase() : Math.floor(100000 + Math.random() * 900000));

            return {
              id: row.id,
              bookingCode: shortCode,
              customerName: row.customer_name || '',
              customerMobile: row.mobile_number || '',
              pickup: row.pickup_location || 'Salem Central Hub',
              destination: row.destination || '',
              distanceKm: dist,
              estimatedFare: fare,
              ratePerKm: rate,
              status: row.booking_status || 'Pending',
              notes: '',
              createdAt: row.created_at || new Date().toISOString()
            };
          });

          // Merge: remote rows take priority, keep unsynced local rows
          const remoteIds = new Set(remoteRows.map(r => r.id));
          const localBookings = this.getBookings();
          const unsyncedLocal = localBookings.filter(b => !remoteIds.has(b.id));
          const merged = [...formattedRemote, ...unsyncedLocal];

          setStorageItem(STORAGE_KEYS.BOOKINGS, merged);
          window.dispatchEvent(new CustomEvent('cabdb:synced', { detail: { count: remoteRows.length } }));
          return merged;
        }
      } catch (err) {
        console.warn('[CabDB] Supabase cloud fetch exception:', err);
      }
      return false;
    }
  };

  // Expose CabDB and MitharaDB to global scope
  window.CabDB = CabDB;
  window.MitharaDB = CabDB;

  // Background auto-sync with Supabase on page load
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      CabDB.syncWithSupabase();
    }, 600);
  }

})(typeof window !== 'undefined' ? window : this);
