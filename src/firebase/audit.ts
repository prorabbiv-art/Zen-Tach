import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

export interface AdminAuditEntry {
  adminUid: string;
  adminEmail: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'inventory_update' | 'settings_update';
  target: 'product' | 'order' | 'category' | 'coupon' | 'banner' | 'settings';
  targetId: string;
  details?: Record<string, any>;
  timestamp: string;
}

export async function logAdminAction(
  adminUid: string,
  adminEmail: string,
  action: AdminAuditEntry['action'],
  target: AdminAuditEntry['target'],
  targetId: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    const entry: AdminAuditEntry = {
      adminUid,
      adminEmail,
      action,
      target,
      targetId,
      details: details || {},
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'auditLogs'), entry);
  } catch (err) {
    // Audit logs must fail safely without blocking admin operation if offline
    console.warn('Audit logging note:', err);
  }
}
