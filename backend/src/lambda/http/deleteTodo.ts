import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

// import { cors, httpErrorHandler } from "middy/middlewares";

import { deleteTodo } from "../../businessLogic/todos";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId;

      const userId = getUserId(event);

      // TODO: Remove a TODO item by id

      const deletedItem = await deleteTodo(todoId, userId);

      return {
        statusCode: 204,

        body: JSON.stringify({
          deletedItem,
        }),
      };
    } catch (error) {
      return {
        statusCode: error.statusCode,

        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
  }
);

// use(httpErrorHandler())

handler.use(
  cors({
    credentials: true,
  })
);
