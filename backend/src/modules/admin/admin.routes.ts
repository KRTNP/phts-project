import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware.js';
import { UserRole } from '../../types/auth.js';
import * as systemController from './system.controller.js';
import * as officerController from './officer.controller.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Officer only access
const officerAuth = restrictTo(UserRole.PTS_OFFICER);

router.get('/holidays', officerAuth, officerController.getHolidays);
router.post('/holidays', officerAuth, officerController.addHoliday);
router.delete('/holidays/:date', officerAuth, officerController.deleteHoliday);

router.get('/rates', officerAuth, officerController.getMasterRates);
router.put('/rates/:rateId', officerAuth, officerController.updateMasterRate);

router.put('/leaves/:id/adjust', officerAuth, officerController.adjustLeaveRequest);

// Admin only
const adminAuth = restrictTo(UserRole.ADMIN);

router.get('/users', adminAuth, systemController.searchUsers);
router.put('/users/:userId/role', adminAuth, systemController.updateUserRole);

router.post('/system/sync', adminAuth, systemController.triggerSync);
router.post('/system/maintenance', adminAuth, systemController.toggleMaintenanceMode);
router.post('/system/backup', adminAuth, systemController.triggerBackup);

export default router;
