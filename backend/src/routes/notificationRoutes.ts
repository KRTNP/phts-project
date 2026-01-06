import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import * as notifCtrl from '../controllers/notificationController.js';

const router = Router();

router.use(protect);

router.get('/', notifCtrl.getMyNotifications);
router.put('/:id/read', notifCtrl.markRead);

export default router;
