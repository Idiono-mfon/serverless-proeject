import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
// import { getUserId } from "../utils";
import { createTodo } from "../../helpers/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body);
      // Handle Authentication latter
      const newItem = await createTodo(newTodo);

      return {
        statusCode: 201,

        body: JSON.stringify({
          newItem,
        }),
      };
    } catch (error) {
      return {
        statusCode: error.statusCode || 500,

        body: JSON.stringify({
          message: error.message || "Internal Server Error",
        }),
      };
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
