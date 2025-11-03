import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import QuickReportModel from '../../../infrastructure/models/QuickReportModel';

const createSchema = Joi.object({
  projectId: Joi.string().required(),
  date: Joi.date().required(),
});

const updateManpowerSchema = Joi.object({
  manpower: Joi.array().items(
    Joi.object({
      role: Joi.string().required(),
      count: Joi.number().integer().min(0).required(),
    })
  ).required(),
});

export async function getQuickReport(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    const { date } = req.query;
    
    let query: any = { projectId };
    if (date) {
      const selectedDate = new Date(date as string);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const quickReport = await QuickReportModel.findOne(query).sort({ createdAt: -1 });
    
    if (!quickReport) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        error: { message: 'Quick report not found' },
        quickReport: null 
      });
    }
    
    res.json({ quickReport });
  } catch (error: any) {
    console.error('Error getting quick report:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to get quick report' }
    });
  }
}

export async function createQuickReport(req: Request, res: Response) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });
    
    const user = (req as any).user as { sub: string };
    
    // Check if report already exists for this date
    const existingReport = await QuickReportModel.findOne({
      projectId: value.projectId,
      date: value.date
    });
    
    if (existingReport) {
      return res.status(StatusCodes.CONFLICT).json({
        error: { message: 'Quick report already exists for this date' },
        quickReport: existingReport
      });
    }
    
    const quickReport = await QuickReportModel.create({
      projectId: value.projectId,
      date: value.date,
      manpower: [],
      qualityEntries: [],
      scheduleEntries: [],
      comments: [],
      createdBy: user.sub,
    });
    
    res.status(StatusCodes.CREATED).json({ quickReport });
  } catch (error: any) {
    console.error('Error creating quick report:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to create quick report' }
    });
  }
}

export async function updateManpower(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { value, error } = updateManpowerSchema.validate(req.body);
    if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });
    
    const quickReport = await QuickReportModel.findByIdAndUpdate(
      id,
      { $set: { manpower: value.manpower } },
      { new: true }
    );
    
    if (!quickReport) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Quick report not found' } });
    }
    
    res.json({ quickReport });
  } catch (error: any) {
    console.error('Error updating manpower:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to update manpower' }
    });
  }
}

export async function addQualityEntry(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;
    
    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Content is required' } });
    }
    
    const user = (req as any).user as { sub: string; email: string };
    
    const quickReport = await QuickReportModel.findById(id);
    if (!quickReport) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Quick report not found' } });
    }
    
    const entryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    (quickReport as any).qualityEntries.push({
      authorId: user.sub,
      authorName: user.email,
      content,
      attachments: attachments || [],
      timestamp: new Date(),
    });
    
    await quickReport.save();
    res.json({ quickReport });
  } catch (error: any) {
    console.error('Error adding quality entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to add quality entry' }
    });
  }
}

export async function addScheduleEntry(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;
    
    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Content is required' } });
    }
    
    const user = (req as any).user as { sub: string; email: string };
    
    const quickReport = await QuickReportModel.findById(id);
    if (!quickReport) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Quick report not found' } });
    }
    
    (quickReport as any).scheduleEntries.push({
      authorId: user.sub,
      authorName: user.email,
      content,
      attachments: attachments || [],
      timestamp: new Date(),
    });
    
    await quickReport.save();
    res.json({ quickReport });
  } catch (error: any) {
    console.error('Error adding schedule entry:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to add schedule entry' }
    });
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Content is required' } });
    }
    
    const user = (req as any).user as { sub: string; email: string };
    
    const quickReport = await QuickReportModel.findById(id);
    if (!quickReport) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Quick report not found' } });
    }
    
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    (quickReport as any).comments.push({
      id: commentId,
      authorId: user.sub,
      authorName: user.email,
      content,
      timestamp: new Date(),
      isDeleted: false,
    });
    
    await quickReport.save();
    res.json({ quickReport });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: error.message || 'Failed to add comment' }
    });
  }
}

