// app/api/verify/route.js
import dbConnect from '../dbConnect';
import FormData from '../../../models/FormData';

export const PATCH = async (req, res) => {
  await dbConnect();
  const { prnNo } = req.query;
  const { role } = req.body;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.verificationStatus[role] !== undefined) {
      application.verificationStatus[role] = !application.verificationStatus[role];

      const allVerified = Object.values(application.verificationStatus).every(status => status === true);
      if (allVerified) {
        application.applicationStatus = "Accepted";
      }

      await application.save();
      res.status(200).json(application);
    } else {
      res.status(400).json({ error: 'Invalid role specified' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update verification status' });
  }
};
