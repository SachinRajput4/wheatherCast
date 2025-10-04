import express from 'express';
import { getCollectionByDate,getCollectionByMonth,getStudentByDate,getStudentByMonth} from '../controllers/ViewAttendanceHistoryController.js';
import user2Auth from '../middleware/user2Auth.js';


const viewAttendanceHistoryRouter = express.Router();


// Teacher view: Fetch attendance by date and collectionId
// viewAttendanceHistoryRouter.get('/teacher-collection-date-attendance', getTeacherAttendance);
// Student view: Fetch all attendance by studentId and collectionId
// viewAttendanceHistoryRouter.get('/student--date-attendance', getStudentAttendance);
viewAttendanceHistoryRouter.get("/collection/date", getCollectionByDate);
viewAttendanceHistoryRouter.get("/collection/month", getCollectionByMonth);
viewAttendanceHistoryRouter.get("/student/month", getStudentByMonth);
viewAttendanceHistoryRouter.get("/student/date", getStudentByDate);

export default viewAttendanceHistoryRouter;
