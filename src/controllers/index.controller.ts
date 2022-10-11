import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendFile('index.html', { root: 'src/views' });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
