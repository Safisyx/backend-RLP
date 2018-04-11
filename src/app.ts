import 'reflect-metadata'
import {createKoaServer} from "routing-controllers"
import { Action, BadRequestError } from "routing-controllers";
import { verify } from "./jwt";
import User from "./entities/user"

export default createKoaServer({
  cors: true,
  controllers: [],
    authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      try {
        return !!(token && verify(token));
      } catch (e) {
        throw new BadRequestError(e);
      }
    }

    return false;
  },
  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      if (token) {
        const id = verify(token);
        return User.findOneById(id);
      }
    }
    return undefined;
  }
});
