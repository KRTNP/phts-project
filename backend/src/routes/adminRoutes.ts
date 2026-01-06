import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { UserRole } from '../types/auth.js';
import * as adminCtrl from '../controllers/adminController.js';
import * as officerCtrl from '../controllers/officerController.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Officer/ADMIN access
const officerAuth = restrictTo(UserRole.PTS_OFFICER, UserRole.ADMIN);

router.get('/holidays', officerAuth, officerCtrl.getHolidays);
router.post('/holidays', officerAuth, officerCtrl.addHoliday);
router.delete('/holidays/:date', officerAuth, officerCtrl.deleteHoliday);

router.get('/rates', officerAuth, officerCtrl.getMasterRates);
router.put('/rates/:rateId', officerAuth, officerCtrl.updateMasterRate);

router.put('/leaves/:id/adjust', officerAuth, officerCtrl.adjustLeaveRequest);

// Admin only
const adminAuth = restrictTo(UserRole.ADMIN);

router.get('/users', adminAuth, adminCtrl.searchUsers);
router.put('/users/:userId/role', adminAuth, adminCtrl.updateUserRole);

router.post('/system/maintenance', adminAuth, adminCtrl.toggleMaintenanceMode);
router.post('/system/backup', adminAuth, adminCtrl.triggerBackup);

export default router;
