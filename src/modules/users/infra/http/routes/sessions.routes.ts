import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

// Responsabilidades da Rota: Receber a requisição, chamar outro arquivo e devolver uma resposta

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
