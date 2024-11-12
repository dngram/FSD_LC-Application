// app/api/statusByPrn/route.js
import dbConnect from '../dbConnect';
import FormData from '../../../models/FormData';

export const GET = async (req, res) => {
  await dbConnect();
  const { prnNo } = req.query;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};
