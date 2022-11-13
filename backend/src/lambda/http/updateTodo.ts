import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
// import { cors, httpErrorHandler } from "middy/middlewares";

import { updateTodo } from "../../helpers/todos";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { getUserId } from "../utils";
//
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId;
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

      const userId = getUserId(event);

      const updatedItem = await updateTodo(todoId, userId, updatedTodo);

      return {
        statusCode: 200,

        body: JSON.stringify({
          item: updatedItem,
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

// .use(httpErrorHandler())

handler.use(
  cors({
    credentials: true,
  })
);
