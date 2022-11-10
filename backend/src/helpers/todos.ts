import { TodosAccess } from "./todosAcess";
// import { AttachmentUtils } from "./attachmentUtils";
import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import * as createError from "http-errors";
// import { info } from "console";

// TODO: Implement businessLogic
const logger = createLogger("TodoService");

// import { getUserId } from "../auth/utils";

const todoAccess = new TodosAccess();

export async function getAllTodos(): Promise<TodoItem[]> {
  logger.info("Called todoAccess.getAllTodoItems");

  return todoAccess.getAllTodoItems();
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest
  //   jwtToken: string
): Promise<TodoItem> {
  const itemId = uuid.v4();
  const userId = "1";
  //   const userId = getUserId(jwtToken);
  logger.info("Called todoAccess.createGroup");

  return await todoAccess.createTodoItem({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: "https://test",
  });
}

export async function getTodo(todoItem: string) {
  logger.info(`Called todoAccess.getTodoItem with ${todoItem}`);
  return todoAccess.getTodoItem(todoItem);
}

export async function updateTodo(
  todoItem: string,
  updatedFields: UpdateTodoRequest
) {
  logger.info(`Called todoAccess.TodoItemExists with ${todoItem}`);
  //   Check if TodoItem exist
  const todoExists = todoAccess.TodoItemExists(todoItem);

  if (!todoExists) throw createError(404, "Todo Item does not exist");

  logger.info(
    `Called todoAccess.updateTodoItem with ${todoItem} and ${updatedFields}`
  );

  return todoAccess.updateTodoItem(todoItem, updatedFields);
}

export async function deleteTodo(todoItem: string) {
  logger.info(`Called todoAccess.TodoItemExists with ${todoItem}`);
  //   Check if TodoItem exist
  const todoExists = todoAccess.TodoItemExists(todoItem);

  if (!todoExists) throw createError(404, "Todo Item does not exist");

  logger.info(`Called todoAccess.deleteTodoItem with ${todoItem} `);

  return todoAccess.deleteTodoItem(todoItem);
}
